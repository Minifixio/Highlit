/**
 * Imports
 */
import { WinningTeam } from '../models/WinningTeam';
import { Kill } from '../models/Kill';
import { Player } from 'demofile';
import { Round } from '../models/Round';
export declare class RoundParser {
    roundNumber: number;
    startTime: number;
    endTime: number;
    winningTeam: WinningTeam | null;
    kills: Kill[];
    private multiKills;
    endReason: number;
    private buy;
    private clutch;
    constructor(roundNumber: number, startTime: number);
    addPause(): void;
    addKill(attacker: Player | null, victim: Player | null, time: number): void;
    makeBuy(tEquipment: number, ctEquipment: number): void;
    end(): void;
    export(): Round;
}
