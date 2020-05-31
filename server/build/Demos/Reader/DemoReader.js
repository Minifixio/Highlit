"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoReader = void 0;
const fs = __importStar(require("fs"));
const demofile_1 = require("demofile");
const MatchParser_1 = require("./MatchParser");
class DemoReader {
    constructor(fileInput, matchId, expectedRounds) {
        this.fileInput = fileInput;
        this.matchParser = new MatchParser_1.MatchParser(expectedRounds, matchId);
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs.readFile(this.fileInput, (err, buffer) => {
                    if (err) {
                        this.matchParser.matchLogger.endLogs();
                        reject(err);
                    }
                    const demoFile = new demofile_1.DemoFile();
                    demoFile.on('end', () => {
                        this.matchParser.roundOfficiallyEnd();
                        if (this.matchParser.endMatch()) {
                            resolve(this.matchParser.rounds);
                        }
                        else {
                            this.matchParser.matchLogger.matchLog('wrong parsing');
                            this.matchParser.matchLogger.endLogs();
                            reject('wrong parsing');
                        }
                        demoFile.cancel();
                    });
                    demoFile.entities.on('change', e => this.handlePause(e, demoFile.teams));
                    demoFile.gameEvents.on('round_start', () => {
                        this.matchParser.roundStart(demoFile.gameRules.roundNumber, demoFile.currentTime);
                    });
                    demoFile.gameEvents.on('round_end', e => {
                        const terrorists = demoFile.teams[2];
                        const cts = demoFile.teams[3];
                        let tEquipment = null;
                        let ctEquipment = null;
                        if (cts.members.length !== 0 && terrorists.members.length !== 0) {
                            tEquipment = terrorists.members.filter(player => player).reduce((acc, val) => {
                                acc += val.freezeTimeEndEquipmentValue;
                                return acc;
                            }, 0);
                            ctEquipment = cts.members.filter(player => player).reduce((acc, val) => {
                                acc += val.freezeTimeEndEquipmentValue;
                                return acc;
                            }, 0);
                        }
                        if (tEquipment == null || ctEquipment == null) {
                            ctEquipment = 25000;
                            tEquipment = 25000;
                        }
                        this.matchParser.currentRound.makeBuy(tEquipment, ctEquipment);
                        this.matchParser.roundEnd(e.winner, e.reason, demoFile.teams, demoFile.currentTime);
                    });
                    demoFile.gameEvents.on('round_officially_ended', () => {
                        this.matchParser.roundOfficiallyEnd();
                        if (this.matchParser.endMatch()) {
                            resolve(this.matchParser.export());
                            demoFile.cancel();
                        }
                    });
                    demoFile.gameEvents.on('round_announce_match_start', () => {
                        if (this.matchParser.rounds.length < 15) {
                            this.matchParser.startMatch();
                        }
                        if (this.matchParser.rounds.length === 15) {
                            this.matchParser.halfTime();
                        }
                        if (this.matchParser.rounds.length > 15) {
                            if (this.matchParser.endMatch() !== false) {
                                resolve(this.matchParser.rounds);
                            }
                        }
                    });
                    demoFile.gameEvents.on('player_death', kill => {
                        const attacker = demoFile.entities.getByUserId(kill.attacker);
                        const victim = demoFile.entities.getByUserId(kill.userid);
                        this.matchParser.currentRound.addKill(attacker, victim, demoFile.currentTime);
                    });
                    demoFile.gameEvents.on('buytime_ended', () => {
                        const terrorists = demoFile.teams[2];
                        const cts = demoFile.teams[3];
                        let tEquipment = null;
                        let ctEquipment = null;
                        if (cts.members.length !== 0 && terrorists.members.length !== 0) {
                            tEquipment = terrorists.members.filter(player => player).reduce((acc, val) => {
                                acc += val.freezeTimeEndEquipmentValue;
                                return acc;
                            }, 0);
                            ctEquipment = cts.members.filter(player => player).reduce((acc, val) => {
                                acc += val.freezeTimeEndEquipmentValue;
                                return acc;
                            }, 0);
                        }
                        if (tEquipment == null || ctEquipment == null) {
                            ctEquipment = 25000;
                            tEquipment = 25000;
                        }
                        this.matchParser.currentRound.makeBuy(tEquipment, ctEquipment);
                    });
                    demoFile.gameEvents.on('begin_new_match', () => {
                        if (this.matchParser.rounds.length < 15) {
                            this.matchParser.startMatch();
                        }
                    });
                    demoFile.parse(buffer);
                });
            });
        });
    }
    handlePause(e, teams) {
        if (e.tableName === "DT_VoteController" &&
            e.varName === "m_iOnlyTeamToVote" &&
            e.newValue !== -1) {
            teams.map(team => {
                if (team.props.DT_Team.m_iTeamNum === e.entity.props.DT_VoteController.m_iOnlyTeamToVote) {
                    this.matchParser.currentRound.addPause();
                    this.matchParser.matchLogger.matchLog(`Team called timeout: ${team.props.DT_Team.m_szClanTeamname}`);
                }
            });
        }
    }
}
exports.DemoReader = DemoReader;
//# sourceMappingURL=DemoReader.js.map