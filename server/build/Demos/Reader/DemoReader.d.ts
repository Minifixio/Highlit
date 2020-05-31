import { Team } from 'demofile';
import { Round } from '../models/Round';
export declare class DemoReader {
    private fileInput;
    private matchParser;
    constructor(fileInput: string, matchId: number, expectedRounds: number);
    read(): Promise<Round[]>;
    handlePause(e: any, teams: Team[]): void;
}
