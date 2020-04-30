/**
 * Imports
 */
const demofile = require("demofile")
const fs = require("fs")
var debugManager = require("./debug_manager.js");
//var socketManager = require("./socket_manager.js");

/**
 * Utils
 */
const multiKillsUtil = require("./utils/multikills.js");
let computeMultiKills = multiKillsUtil.computeMultiKills;

const buyTypeUtil = require("./utils/buy_type.js");
let getBuyType = buyTypeUtil.getBuyType;

const clutchUtil = require("./utils/clutch.js");
let computeClutch = clutchUtil.computeClutch;

const events = {
    demo: {
        END: "end"
    },

    game: {
        ROUND_START: "round_start",
        ROUND_END: "round_end",
        ROUND_OFFICIALLY_ENDED: "round_officially_ended",
        ROUND_ANNOUNCE_MATCH_START: "round_announce_match_start",
        BUYTIME_ENDED: "buytime_ended",
        PLAYER_DEATH: "player_death",
        ROUND_ANNOUNCE_LAST_ROUND_HALF: "round_announce_last_round_half",
        ROUND_ANNOUNCE_FINAL: "round_announce_final",
        BEGIN_NEW_MATCH: "begin_new_match"
    },

    entities: {
        CHANGE: "change"
    }
}

class Round {
    constructor(id, startTime) {
        this.id = id
        this.start_time = startTime
        this.end_time
        this.winning_team
        this.kills = []
        this.multi_kills = []
        this.end_reason
        this.buy
        this.clutch
    }

    addPause() {
        this.start_time += 30
    }

    addKill(attacker, victim, time) {

        const victimName = victim ? victim.name : "unnamed";
        const attackerName = attacker ? attacker.name : "unnamed";
        
        let killInfos = {
            attacker_name: attackerName, 
            victim_name: victimName, 
            victim_team: victim.teamNumber == 2 ? 't' : 'ct',
            attacker_team: attacker ? (attacker.teamNumber == 2 ? 't' : 'ct') : victim.teamNumber == 2 ? 'ct' : 't', // Handling the case where the player kills himself
            time: time
        }

        this.kills.push(killInfos)
    }

    makeBuy(tEquipment, ctEquipment) {
        this.buy = {
            t: {
                value: tEquipment,
                type: getBuyType(tEquipment)
            },
            ct: {
                value: ctEquipment,
                type: getBuyType(ctEquipment)
            }
        }
    }

    end() {
        this.multi_kills = computeMultiKills(this.kills)
        this.clutch = computeClutch(this.kills, this.winning_team)
    }
}

class MatchInfos {
    constructor(expectedRounds, matchId) {
        this.expectedRounds = expectedRounds
        this.rounds = []
        this.currentRound = new Round(0, 0)
        this.matchLogger = new debugManager.DemoReadingLogger(matchId);
    }

    startMatch() {
        this.matchLogger.matchLog('match started')
        this.rounds = []
    }

    endMatch() {
        if (this.rounds.length == this.expectedRounds) {
            this.matchLogger.matchLog('match ended')
            this.syncRounds()
            this.matchLogger.endLogs()
            return true
        } else {
            return false
        }
    }

    roundStart(id, time) {
        if (id < this.rounds.length) {
            id = this.rounds.length + 1
        }

        this.currentRound = new Round(id, time)
        this.matchLogger.roundLog(id, 'started')
    }

    roundEnd(winner, reason, teams, time) {
        if (winner == 2) { // id n°2 means terrorists
            this.currentRound.winning_team = {
                side: 't',
                team_name: teams[2].clanName
            };
        } 
        if (winner == 3) { // else it is CTs
            this.currentRound.winning_team = {
                side: 'ct',
                team_name: teams[3].clanName
            };
        }

        if (winner != 2 && winner != 3) {
            this.currentRound.winning_team = null
        }
        
        this.currentRound.end_time = time
        this.currentRound.end_reason = reason
        this.matchLogger.roundLog(this.currentRound.id, 'ended : ' + (this.currentRound.winning_team? this.currentRound.winning_team.team_name: undefined))
    }

    roundOfficiallyEnd() {
        this.currentRound.end()

        if (this.currentRound.winning_team == null || this.currentRound.kills.length > 9) {
            this.matchLogger.matchLog('wrong round')
        } else {
            this.rounds.push(this.currentRound)
        }
    }

    halfTime() {
        this.matchLogger.matchLog('halftime')
    }

    syncRounds() {
        this.rounds.forEach(round => {
            round.start_time = round.start_time - this.rounds[0].start_time
        })
    }
}

module.exports.DemoReader = class DemoReader {
    constructor(fileInput, matchId, expectedRounds) {
        this.fileInput = fileInput
        this.matchInfos = new MatchInfos(expectedRounds, matchId)
        this.demoFile
    }

    async read() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.fileInput, (err, buffer) => {

                if (err) {
                    this.matchInfos.matchLogger.endLogs()
                    reject(err)
                }

                this.demoFile = new demofile.DemoFile();

                this.demoFile.on(events.demo.END, () => {
                    this.matchInfos.roundOfficiallyEnd()
                    if(this.matchInfos.endMatch()) {
                        resolve(this.matchInfos.rounds)
                    } else {
                        this.matchInfos.matchLogger.matchLog('wrong parsing')
                        this.matchInfos.matchLogger.endLogs()
                        reject('wrong parsing')
                    }

                    this.demoFile.cancel()
                })
                    
                this.demoFile.entities.on(events.entities.CHANGE, e => this.handlePause(e))
    
                this.demoFile.gameEvents.on(events.game.ROUND_START, () => {
                    this.matchInfos.roundStart(this.demoFile.gameRules.roundNumber, this.demoFile.currentTime)
                })
    
                this.demoFile.gameEvents.on(events.game.ROUND_END, e => {
                    this.matchInfos.roundEnd(e.winner, e.reason, this.demoFile.teams, this.demoFile.currentTime)
                })
    
                this.demoFile.gameEvents.on(events.game.ROUND_OFFICIALLY_ENDED, () => {
                    this.matchInfos.roundOfficiallyEnd()
                    if (this.matchInfos.endMatch()) {
                        resolve(this.matchInfos.rounds)
                        this.demoFile.cancel()
                    }
                })
    
                this.demoFile.gameEvents.on(events.game.ROUND_ANNOUNCE_MATCH_START, () => {
                    if (this.matchInfos.rounds.length < 15) {
                        this.matchInfos.startMatch()
                    }
    
                    if (this.matchInfos.rounds.length == 15) {
                        this.matchInfos.halfTime()
                    }
    
                    if (this.matchInfos.rounds.length > 15) {
                        if (this.matchInfos.endMatch() != false) {
                            resolve(this.matchInfos.rounds)
                        }
                    }
                })

                this.demoFile.gameEvents.on(events.game.PLAYER_DEATH, kill => {
                    let attacker = this.demoFile.entities.getByUserId(kill.attacker)
                    let victim = this.demoFile.entities.getByUserId(kill.userid)
                    this.matchInfos.currentRound.addKill(attacker, victim, this.demoFile.currentTime)
                })

                this.demoFile.gameEvents.on(events.game.BUYTIME_ENDED, () => {
                    const terrorists = this.demoFile.teams[2]
                    const cts = this.demoFile.teams[3]
                    let tEquipment, ctEquipment = null

                    if (cts.members.length != 0 && terrorists.members.length != 0) {
                        tEquipment = terrorists.members.filter(player => player).reduce((a, b) => (
                            {freezeTimeEndEquipmentValue: a.freezeTimeEndEquipmentValue + b.freezeTimeEndEquipmentValue}
                            )).freezeTimeEndEquipmentValue

                        ctEquipment= cts.members.filter(player => player).reduce((a, b) => (
                            {freezeTimeEndEquipmentValue: a.freezeTimeEndEquipmentValue + b.freezeTimeEndEquipmentValue}
                            )).freezeTimeEndEquipmentValue
                    }

                    if (tEquipment== null || ctEquipment == null) {
                        tEquipment, ctEquipment = 25000
                    }

                    this.matchInfos.currentRound.makeBuy(tEquipment, ctEquipment)
                })

                this.demoFile.gameEvents.on(events.game.BEGIN_NEW_MATCH, () => {
                    if (this.matchInfos.rounds.length < 15) {
                        this.matchInfos.startMatch()
                    }
                })

                this.demoFile.parse(buffer)
            })
        })
    }

    handlePause(e) {
        if (
            e.tableName == "DT_VoteController" &&
            e.varName == "m_iOnlyTeamToVote" &&
            e.newValue !== -1
        ) {
            this.demoFile.teams.map(team => {
                if (team.props.DT_Team.m_iTeamNum == e.entity.props.DT_VoteController.m_iOnlyTeamToVote) {
                    this.matchInfos.currentRound.addPause()
                    this.matchInfos.matchLogger.matchLog(`Team called timeout: ${team.props.DT_Team.m_szClanTeamname}`);
                }
            });
        }

    }
}