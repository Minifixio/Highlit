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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggers = exports.demoReadingLogger = exports.errorsLogger = exports.debugMode = exports.logLocation = void 0;
exports.logLocation = ('./logs/');
const winston = __importStar(require("winston"));
const LoggerOptions_1 = require("./LoggerOptions");
const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');
exports.debugMode = false;
if (process.env.NODE_ENV === 'test') {
    exports.debugMode = true;
}
class LoggerService {
    constructor(name, components, logger) {
        this.name = name;
        this.components = components;
        this.logger = logger;
    }
    isComponent(name) {
        if (this.components.includes(name)) {
            return true;
        }
    }
}
const mainLogger = new LoggerService('main', ['cron', 'db', 'demo_manager', 'hltv', 'mail', 'twitch', 'app', 'test'], winston.createLogger(new LoggerOptions_1.LoggerOptions('main')));
const serverLogger = new LoggerService('server', ['http', 'sockets', 'app'], winston.createLogger(new LoggerOptions_1.LoggerOptions('server')));
const demosLogger = new LoggerService('demos', ['demo_manager', 'demo_reader'], winston.createLogger(new LoggerOptions_1.LoggerOptions('demos')));
exports.errorsLogger = new LoggerService('errors', [], winston.createLogger(LoggerOptions_1.errorsLoggerOpts));
exports.demoReadingLogger = new LoggerService('demos_reading', [], winston.createLogger(LoggerOptions_1.demoReadingLoggerOpts));
exports.loggers = [mainLogger, serverLogger, demosLogger, exports.demoReadingLogger, exports.errorsLogger];
if (exports.debugMode) {
    mainLogger.logger.add(new winston.transports.Console({
        format: LoggerOptions_1.consoleFormat,
        log(info, callback) {
            if (this.stderrLevels && this.stderrLevels[info[LEVEL]]) {
                console.error(info[MESSAGE]);
                if (callback) {
                    callback();
                }
                return;
            }
            console.log(info[MESSAGE]);
            if (callback) {
                callback();
            }
        }
    }));
}
//# sourceMappingURL=DebugManager.js.map