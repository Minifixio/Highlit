import { DemoLog } from "./models/DemoLog";
import { demoReadingLogger, debugMode } from "./DebugManager";

export class DemoReadingLogger {

    public matchId: number
    public matchLogsInfos: DemoLog[]

    constructor(matchId: number) {
        this.matchId = matchId;
        this.matchLogsInfos = [];
    }

    roundLog(roundId: number, infos: string) {
        if (debugMode) { console.log({type: 'round', roundId, infos}) }
        this.matchLogsInfos.push({type: 'round', roundId, infos})
    }

    matchLog(infos: string) {
        if (debugMode) { console.log({type: 'other', infos}) }
        this.matchLogsInfos.push({type: 'other', infos})
    }

    endLogs() {
        demoReadingLogger.logger.info({matchId: this.matchId, matchInfos: this.matchLogsInfos});
    }
}