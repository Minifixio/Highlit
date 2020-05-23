/**
 * Imports
 */
var debugManager = require("./debug_manager.js");
//var socketManager = require("./socket_manager.js");

/**
 * Utils
 */
import { computeMultiKills } from './utils/Multikills'
import { getBuyType } from './utils/BuyType'
import { computeClutch } from './utils/Clutch'
import { WinningTeam } from '../models/WinningTeam';
import { Kill } from '../models/Kill';
import { MultipleKills } from '../models/MultipleKills';
import { Buy } from '../models/BuyType';
import { Clutch } from '../models/Clutch';
import { Player } from 'demofile';
import { Round } from '../models/Round';

export class RoundParser {

    public roundNumber: number
    public startTime: number
    public endTime: number = 0
    public winningTeam: WinningTeam | null = null
    public kills: Kill[] = []
    private multiKills: MultipleKills = { triples: [], quads: [], aces: [] }
    public endReason: number = 0
    private buy: Buy | null = null
    private clutch: Clutch | null = null

    constructor(roundNumber: number, startTime: number) {
        this.roundNumber = roundNumber
        this.startTime = startTime
    }

    addPause(): void {
        this.startTime += 30
    }

    addKill(attacker: Player | null, victim: Player | null, time: number): void {
        let victimName: string = "unnamed";
        let attackerName: string = "unnamed";

        let victimTeam: string = "undefined";
        let attackerTeam: string = "undefined";

        // Handling the case where the player kills himself
        if (!victim || !attacker) {
            if (attacker && !victim) {
                attackerName = attacker.name
                victimName = attacker.name

                victimTeam = attacker.teamNumber === 2 ? 't' : 'ct'
                attackerTeam = attacker.teamNumber === 2 ? 'ct' : 't'
            }

            if (victim && !attacker) {
                attackerName = victim.name
                victimName = victim.name

                attackerTeam = victim.teamNumber === 2 ? 'ct' : 't'
                victimTeam = victim.teamNumber === 2 ? 't' : 'ct'
            }
        } else {
            attackerName = attacker.name
            victimName = victim.name

            attackerTeam = attacker.teamNumber === 2 ? 't': 'ct'
            victimTeam = victim.teamNumber === 2 ? 't': 'ct'
        }

        const killInfos: Kill = {
            attacker_name: attackerName,
            victim_name: victimName,
            victim_team: victimTeam,
            attacker_team: attackerTeam,
            time
        }

        this.kills.push(killInfos)
    }

    makeBuy(tEquipment: number, ctEquipment: number): void {
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

    end(): void {
        this.multiKills = computeMultiKills(this.kills)
        this.clutch = computeClutch(this.kills, this.winningTeam)
    }

    export(): Round {
        const roundInfos: Round = {
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
        }

        return roundInfos
    }
}