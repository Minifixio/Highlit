/**
 * Imports
 */
const demofile = require("demofile")
const fs = require("fs")
var socketManager = require("./socket_manager.js");
var debugManager = require("./debug_manager.js");
const logger = new debugManager.logger("DemoReader");

/**
 * Utils
 */
const multiKillsUtil = require("./utils/multikills.js");
let computeMultiKills = multiKillsUtil.computeMultiKills;

const buyTypeUtil = require("./utils/buy_type.js");
let getBuyType = buyTypeUtil.getBuyType;

exports.readDemo = function readDemo(demofileInput, matchId) {

    return new Promise((resolve) => {
        var timeOut = false;
        var winningTeam = {};
        var roundId = 0;
        var timeReference = 0;
        var lastRoundTime = 0;
        var roundKills = [];
        var matchInfos = [];
        var lastRoundId = 0;
        var roundEndReason;
        var clutch = {};
        var localTeams = [];
        var tEquipmentValue = 0;
        var ctEquipmentValue = 0;
    
        logger.debug('Reading demo: ' + demofileInput);
    
        fs.readFile(demofileInput, (err, buffer) => {
            const demoFile = new demofile.DemoFile();

            demoFile.on("end", ()=> {
                makeRoundStats();
                logger.debug('Match Ended !');
                resolve(matchInfos);
                demoFile.cancel();
            });


            /**
             * Handle teams tac/tec pauses
             */
            demoFile.entities.on("change", e => {
                if (
                  e.tableName == "DT_VoteController" &&
                  e.varName == "m_iOnlyTeamToVote" &&
                  e.newValue !== -1
                ) {
                    timeOut = true;
    
                    demoFile.teams.map(team => {
                        if (
                        team.props.DT_Team.m_iTeamNum ==
                        e.entity.props.DT_VoteController.m_iOnlyTeamToVote
                        ) {
                        logger.debug(
                            `Team called timeout: ${team.props.DT_Team.m_szClanTeamname}`
                        );
                        }
                    });
                }
            });


            /**
             * When a rounds starts
             */
            demoFile.gameEvents.on("round_start", () => {
                // To set the time reference to 0 when the match starts
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];

                if (terrorists.score + cts.score == 0) { // When the matchs ends or when it starts, score reset to 0

                    if (roundId < 2) {
                        startMatch()
                    }

                    if (roundId > 15) { // Means at least 15 rounds have been played so the match ended
                        logger.debug('Match has ENDED');
                        resolve(matchInfos);
                        demoFile.cancel();
                    }
                }

                roundKills = []; // Reset kills when the round starts
            })
    

            /**
             * This events triggers when : match starts, teams change sides, match ends
             */
            demoFile.gameEvents.on("round_announce_match_start", () => {
                /*
                * In some special demos (as ESEA), post-game phase or event game-end isn't working...
                * ...but "round_announce_match_start" seems to trigger when sides are switching and when match ends.
                */
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];
                
                if (terrorists.score + cts.score == 15) { 
                    logger.debug('Changing sides');
                }
                if (terrorists.score + cts.score > 15) {
                    logger.debug('Match has ENDED');
                    resolve(matchInfos);
                    demoFile.cancel();
                } 
                if (terrorists.score + cts.score == 0 && roundId < 14) {
                    startMatch();
                }
            });

            /**
             * Handle deaths
             */
            demoFile.gameEvents.on("player_death", e => {

                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];

                let aliveCTs, aliveTs = 0;

                var killInfos = {}; // Store kills infos
                const victim = demoFile.entities.getByUserId(e.userid);
                const victimName = victim ? victim.name : "unnamed";
        
                const attacker = demoFile.entities.getByUserId(e.attacker);
                const attackerName = attacker ? attacker.name : "unnamed";
                
                killInfos = {
                    attacker_name: attackerName, 
                    victim_name: victimName, 
                    victim_team: victim.teamNumber == 2 ? 't' : 'ct',
                    attacker_team: victim.teamNumber == 2 ? 't' : 'ct',
                    time: demoFile.currentTime - timeReference
                }
                
                if (!terrorists.members.length == 0) {
                    aliveTs = terrorists.members.filter(player => player).filter(player => player.isAlive).length;
                    aliveCTs = cts.members.filter(player => player).filter(player => player.isAlive).length;
                }


                if (aliveCTs == 1 && aliveTs >= 2) {
                    let clutcher = cts.members.filter(player => player.isAlive)[0].name;
                    clutch = {team: "ct", player: clutcher, vs: aliveTs, time: demoFile.currentTime - timeReference};
                }

                if (aliveTs == 1 && aliveCTs >=2) {
                    let clutcher = terrorists.members.filter(player => player.isAlive)[0].name;
                    clutch = {team: "t", player: clutcher, vs: aliveCTs, time: demoFile.currentTime - timeReference};
                }

                roundKills.push(killInfos);
            });


            demoFile.gameEvents.on('buytime_ended', () => {
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];

                tEquipmentValue = terrorists.members.filter(player => player).reduce((a, b) => ({freezeTimeEndEquipmentValue: a.freezeTimeEndEquipmentValue + b.freezeTimeEndEquipmentValue})).freezeTimeEndEquipmentValue
                ctEquipmentValue = cts.members.filter(player => player).reduce((a, b) => ({freezeTimeEndEquipmentValue: a.freezeTimeEndEquipmentValue + b.freezeTimeEndEquipmentValue})).freezeTimeEndEquipmentValue

                if (tEquipmentValue == null || tEquipmentValue == null) {
                    tEquipmentValue, ctEquipmentValue = 25000
                }
            });


            /**
             * Event triggers when : bomb is defused, all players are killed or when the timer reached the end.
             */
            demoFile.gameEvents.on("round_end", e => {
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];

                if (localTeams.length == 0) {
                    initTeamsId(terrorists, cts);
                }

                // For later : add reason for ending
                if (e.winner == 2) { // id n°2 means terrorists
                    winningTeam = {
                        side: 't',
                        team_name: teams[2].clanName,
                        team_id: localTeams.length > 0 ? getTeamId(teams[2].clanName) : null
                    };
                } 
                if (e.winner == 3) { // else it is CTs
                    winningTeam = {
                        side: 'ct',
                        team_name: teams[3].clanName,
                        team_id: localTeams.length > 0 ? getTeamId(teams[3].clanName) : null
                    };
                }


                tEquipmentValue = terrorists.members.filter(player => player).reduce((a, b) => ({freezeTimeEndEquipmentValue: a.freezeTimeEndEquipmentValue + b.freezeTimeEndEquipmentValue})).freezeTimeEndEquipmentValue
                ctEquipmentValue = cts.members.filter(player => player).reduce((a, b) => ({freezeTimeEndEquipmentValue: a.freezeTimeEndEquipmentValue + b.freezeTimeEndEquipmentValue})).freezeTimeEndEquipmentValue

                if (tEquipmentValue == null || tEquipmentValue == null) {
                    tEquipmentValue, ctEquipmentValue = 25000
                }
               
                roundEndReason = e.reason;

            });
            

            /**
             * Event triggers when a round officially ends (when the round officially stops)
             */
            demoFile.gameEvents.on("round_officially_ended", () => {
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];

                if ((cts.score == 16 && terrorists.score < 15) || (terrorists.score == 16 && cts.score < 15)) {
                    makeRoundStats();
                    logger.debug('Match reached 16 points');
                    resolve(matchInfos);
                    demoFile.cancel();
                }

                makeRoundStats();
            });


            /**
             * Utils functions
             */
            function initTeamsId(team1, team2) {
                team1.id = 1;
                team2.id = 2;
                localTeams.push(team1, team2);
            }

            function getTeamId(clanName) {
                return localTeams.find(team => team.clanName == clanName).id;
            }

            function startMatch() {
                const teams = demoFile.teams;

                logger.debug('Match is STARTING !');
                resetRoundInfos();
                initTeamsId(teams[2], teams[3]);
                lastRoundTime = 0;
                lastRoundId = 0;
                matchInfos = [];
                timeReference = demoFile.currentTime;
            }

            function makeRoundStats() {
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];
                roundId = cts.score + terrorists.score;

                // Sometimes in some ESEA games, unknown strange rounds appear when sides switch with the same roundId...
                // ...it is just to make sure it does not happen...
                if (roundId !== lastRoundId) {  

                    if (Math.abs(lastRoundId - roundId) >= 14) {
                        roundId = lastRoundId + 1;
                    }

                    // To make sure to remove the 15 sec of warmup + 15 sec because time reference resets on round 1 with +15 sec
                    if (roundId == 1) { 
                        var pastRoundTime = demoFile.currentTime - timeReference - 15;
                    } else {
                        pastRoundTime = demoFile.currentTime - timeReference;
                    }

                    //socketManager.socketEmit('select-map', {type: 'parsing', match_id: matchId, params: roundId});
                    logger.debug('Stats for round n°' + roundId + ' / Winning team: ' + winningTeam.team_name);
    
                    let multipleKills = computeMultiKills(roundKills);

                    if(timeOut == true) {
                        lastRoundTime += 30;
                        pastRoundTime += 30;
                    }
                    
                    let buy = {
                        t: {
                            team_id: getTeamId(terrorists.clanName),
                            value: tEquipmentValue,
                            type: getBuyType(tEquipmentValue)
                        },
                        ct: {
                            team_id: getTeamId(cts.clanName),
                            value: ctEquipmentValue,
                            type: getBuyType(ctEquipmentValue)
                        }
                    }

                    var pastRoundInfo = {
                        start: lastRoundTime,
                        end: pastRoundTime,
                        round_number: roundId,
                        winning_team: winningTeam,
                        kills: roundKills,
                        multiple_kills: multipleKills,
                        round_end_reason: roundEndReason,
                        buy: buy,
                        clutch: (winningTeam.side == clutch.team) ? clutch : null
                    }

                    matchInfos.push(pastRoundInfo);

                    lastRoundTime = demoFile.currentTime - timeReference;
                    lastRoundId = roundId;
                    resetRoundInfos();
                }
            }

            function resetRoundInfos() {
                roundKills = [];
                winningTeam = {};
                timeOut = false;
                clutch = {};
            }

            demoFile.parse(buffer);
        })
    })
    
}