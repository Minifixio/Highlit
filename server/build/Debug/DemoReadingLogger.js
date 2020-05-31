"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoReadingLogger = void 0;
const DebugManager_1 = require("./DebugManager");
class DemoReadingLogger {
    constructor(matchId) {
        this.matchId = matchId;
        this.matchLogsInfos = [];
    }
    roundLog(roundId, infos) {
        if (DebugManager_1.debugMode) {
            console.log({ type: 'round', roundId, infos });
        }
        this.matchLogsInfos.push({ type: 'round', roundId, infos });
    }
    matchLog(infos) {
        if (DebugManager_1.debugMode) {
            console.log({ type: 'other', infos });
        }
        this.matchLogsInfos.push({ type: 'other', infos });
    }
    endLogs() {
        DebugManager_1.demoReadingLogger.logger.info({ matchId: this.matchId, matchInfos: this.matchLogsInfos });
    }
}
exports.DemoReadingLogger = DemoReadingLogger;
//# sourceMappingURL=DemoReadingLogger.js.map