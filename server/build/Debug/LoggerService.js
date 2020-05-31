"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const DebugManager_1 = require("./DebugManager");
class Logger {
    constructor(name) {
        this.name = name;
        this.loggers = findLoggers(this.name);
    }
    debug(message) {
        if (this.loggers.length > 0) {
            this.loggers.forEach(logger => logger.info({ from: this.name, message }));
        }
    }
    error(error, content) {
        if (DebugManager_1.debugMode) {
            console.error(error);
        }
        DebugManager_1.errorsLogger.logger.info({ from: this.name, error: error.name, message: content });
    }
}
exports.Logger = Logger;
function findLoggers(name) {
    const res = [];
    DebugManager_1.loggers.forEach(val => {
        if (val.isComponent(name)) {
            res.push(val.logger);
        }
    });
    return res;
}
//# sourceMappingURL=LoggerService.js.map