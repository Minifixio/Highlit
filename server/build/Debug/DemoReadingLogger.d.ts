import { DemoLog } from "./models/DemoLog";
export declare class DemoReadingLogger {
    matchId: number;
    matchLogsInfos: DemoLog[];
    constructor(matchId: number);
    roundLog(roundId: number, infos: string): void;
    matchLog(infos: string): void;
    endLogs(): void;
}
