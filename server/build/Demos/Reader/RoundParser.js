"use strict";
/**
 * Imports
 */
// var socketManager = require("./socket_manager.js");
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundParser = void 0;
/**
 * Utils
 */
const Multikills_1 = require("./utils/Multikills");
const BuyType_1 = require("./utils/BuyType");
const Clutch_1 = require("./utils/Clutch");
class RoundParser {
    constructor(roundNumber, startTime) {
        this.endTime = 0;
        this.winningTeam = null;
        this.kills = [];
        this.multiKills = { triples: [], quads: [], aces: [] };
        this.endReason = 0;
        this.buy = null;
        this.clutch = null;
        this.roundNumber = roundNumber;
        this.startTime = startTime;
    }
    addPause() {
        this.startTime += 30;
    }
    addKill(attacker, victim, time) {
        let victimName = "unnamed";
        let attackerName = "unnamed";
        let victimTeam = "undefined";
        let attackerTeam = "undefined";
        // Handling the case where the player kills himself
        if (!victim || !attacker) {
            if (attacker && !victim) {
                attackerName = attacker.name;
                victimName = attacker.name;
                victimTeam = attacker.teamNumber === 2 ? 't' : 'ct';
                attackerTeam = attacker.teamNumber === 2 ? 'ct' : 't';
            }
            if (victim && !attacker) {
                attackerName = victim.name;
                victimName = victim.name;
                attackerTeam = victim.teamNumber === 2 ? 'ct' : 't';
                victimTeam = victim.teamNumber === 2 ? 't' : 'ct';
            }
        }
        else {
            attackerName = attacker.name;
            victimName = victim.name;
            attackerTeam = attacker.teamNumber === 2 ? 't' : 'ct';
            victimTeam = victim.teamNumber === 2 ? 't' : 'ct';
        }
        const killInfos = {
            attacker_name: attackerName,
            victim_name: victimName,
            victim_team: victimTeam,
            attacker_team: attackerTeam,
            time
        };
        this.kills.push(killInfos);
    }
    makeBuy(tEquipment, ctEquipment) {
        this.buy = {
            t: {
                value: tEquipment,
                type: BuyType_1.getBuyType(tEquipment)
            },
            ct: {
                value: ctEquipment,
                type: BuyType_1.getBuyType(ctEquipment)
            }
        };
    }
    end() {
        this.multiKills = Multikills_1.computeMultiKills(this.kills);
        this.clutch = Clutch_1.computeClutch(this.kills, this.winningTeam);
    }
    export() {
        const roundInfos = {
            start: this.startTime,
            end: this.endTime,
            round_number: this.roundNumber,
            winning_team: this.winningTeam,
            kills: this.kills,
            multiple_kills: this.multiKills,
            end_reason: this.endReason,
            buy: this.buy,
            clutch: this.clutch,
            twitch_rating: null
        };
        return roundInfos;
    }
}
exports.RoundParser = RoundParser;
//# sourceMappingURL=RoundParser.js.map