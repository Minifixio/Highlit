import * as fs from 'fs'
import { DemoFile } from 'demofile'
import { MatchParser } from "./MatchParser"
import { Team } from 'demofile'

export class DemoReader {

    private fileInput: string
    private matchParser: MatchParser

    constructor(fileInput: string, matchId: number, expectedRounds: number) {
        this.fileInput = fileInput
        this.matchParser = new MatchParser(expectedRounds, matchId)
    }


    async read() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.fileInput, (err, buffer) => {

                if (err) {
                    this.matchParser.matchLogger.endLogs()
                    reject(err)
                }

                const demoFile = new DemoFile();

                demoFile.on('end', () => {
                    this.matchParser.roundOfficiallyEnd()
                    if(this.matchParser.endMatch()) {
                        resolve(this.matchParser.rounds)
                    } else {
                        this.matchParser.matchLogger.matchLog('wrong parsing')
                        this.matchParser.matchLogger.endLogs()
                        reject('wrong parsing')
                    }

                    demoFile.cancel()
                })

                demoFile.entities.on('change', e => this.handlePause(e, demoFile.teams))

                demoFile.gameEvents.on('round_start', () => {
                    this.matchParser.roundStart(demoFile.gameRules.roundNumber, demoFile.currentTime)
                })

                demoFile.gameEvents.on('round_end', e => {
                    const terrorists = demoFile.teams[2]
                    const cts = demoFile.teams[3]
                    let tEquipment = null
                    let ctEquipment = null

                    if (cts.members.length !== 0 && terrorists.members.length !== 0) {
                        tEquipment = terrorists.members.filter(player => player).reduce((acc, val) => {
                            acc += val.freezeTimeEndEquipmentValue
                            return acc
                        }, 0)

                        ctEquipment = cts.members.filter(player => player).reduce((acc, val) => {
                            acc += val.freezeTimeEndEquipmentValue
                            return acc
                        }, 0)
                    }

                    if (tEquipment== null || ctEquipment == null) {
                        ctEquipment = 25000
                        tEquipment = 25000
                    }

                    this.matchParser.currentRound.makeBuy(tEquipment, ctEquipment)

                    this.matchParser.roundEnd(e.winner, e.reason, demoFile.teams, demoFile.currentTime)
                })

                demoFile.gameEvents.on('round_officially_ended', () => {
                    this.matchParser.roundOfficiallyEnd()
                    if (this.matchParser.endMatch()) {
                        resolve(this.matchParser.export())
                        demoFile.cancel()
                    }
                })

                demoFile.gameEvents.on('round_announce_match_start', () => {
                    if (this.matchParser.rounds.length < 15) {
                        this.matchParser.startMatch()
                    }

                    if (this.matchParser.rounds.length === 15) {
                        this.matchParser.halfTime()
                    }

                    if (this.matchParser.rounds.length > 15) {
                        if (this.matchParser.endMatch() !== false) {
                            resolve(this.matchParser.rounds)
                        }
                    }
                })

                demoFile.gameEvents.on('player_death', kill => {
                    const attacker = demoFile.entities.getByUserId(kill.attacker)
                    const victim = demoFile.entities.getByUserId(kill.userid)
                    this.matchParser.currentRound.addKill(attacker, victim, demoFile.currentTime)
                })

                demoFile.gameEvents.on('buytime_ended', () => {
                    const terrorists = demoFile.teams[2]
                    const cts = demoFile.teams[3]
                    let tEquipment = null
                    let ctEquipment = null

                    if (cts.members.length !== 0 && terrorists.members.length !== 0) {
                        tEquipment = terrorists.members.filter(player => player).reduce((acc, val) => {
                            acc += val.freezeTimeEndEquipmentValue
                            return acc
                        }, 0)

                        ctEquipment = cts.members.filter(player => player).reduce((acc, val) => {
                            acc += val.freezeTimeEndEquipmentValue
                            return acc
                        }, 0)
                    }

                    if (tEquipment== null || ctEquipment == null) {
                        ctEquipment = 25000
                        tEquipment = 25000
                    }

                    this.matchParser.currentRound.makeBuy(tEquipment, ctEquipment)
                })

                demoFile.gameEvents.on('begin_new_match', () => {
                    if (this.matchParser.rounds.length < 15) {
                        this.matchParser.startMatch()
                    }
                })

                demoFile.parse(buffer)
            })
        })
    }

    handlePause(e: any, teams: Team[]) {
        if (
            e.tableName === "DT_VoteController" &&
            e.varName === "m_iOnlyTeamToVote" &&
            e.newValue !== -1
        ) {
            teams.map(team => {
                if (team.props.DT_Team.m_iTeamNum === e.entity.props.DT_VoteController.m_iOnlyTeamToVote) {
                    this.matchParser.currentRound.addPause()
                    this.matchParser.matchLogger.matchLog(`Team called timeout: ${team.props.DT_Team.m_szClanTeamname}`);
                }
            });
        }

    }
}