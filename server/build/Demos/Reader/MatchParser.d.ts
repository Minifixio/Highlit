import { Round } from "../models/Round";
import { RoundParser } from "./RoundParser";
import { DemoReadingLogger } from "../../Debug/DemoReadingLogger";
import { Team } from 'demofile';
export declare class MatchParser {
    private expectedRounds;
    rounds: Round[];
    currentRound: RoundParser;
    matchLogger: DemoReadingLogger;
    constructor(expectedRounds: number, matchId: number);
    startMatch(): void;
    endMatch(): boolean;
    roundStart(id: number, time: number): void;
    roundEnd(winner: number, reason: number, teams: Team[], time: number): void;
    roundOfficiallyEnd(): void;
    halfTime(): void;
    syncRounds(): void;
    export(): Round[];
}
