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
exports.errorsLoggerOpts = exports.demoReadingLoggerOpts = exports.LoggerOptions = exports.demoFormat = exports.errorsFormat = exports.fileFormat = exports.consoleFormat = void 0;
const winston = __importStar(require("winston"));
const winston_1 = require("winston");
const DebugManager_1 = require("./DebugManager");
const { combine, prettyPrint } = winston_1.format;
function dateLog() {
    return new Date(Date.now()).toUTCString();
}
exports.consoleFormat = winston.format.printf((info) => {
    let message = `${dateLog()} | ${info.level.toUpperCase()} | `;
    message = info.from ? message + `FROM:${info.from} | ` : message;
    message += info.message;
    return message;
});
exports.fileFormat = winston.format.printf((info) => {
    const message = { date: dateLog(), level: info.level.toLocaleUpperCase(), from: info.from, message: info.message };
    return JSON.stringify(message);
});
exports.errorsFormat = winston.format.printf((info) => {
    const message = { date: dateLog(), level: info.level.toLocaleUpperCase(), from: info.from, error: info.error, message: info.message };
    return JSON.stringify(message);
});
exports.demoFormat = combine(winston_1.format.printf((info) => {
    delete info.level;
    info.match = info.message;
    info.date = dateLog();
    delete info.message;
    return JSON.stringify(info);
}), prettyPrint());
class LoggerOptions {
    constructor(filename) {
        this.format = exports.fileFormat;
        this.transports = [
            new winston.transports.File({ filename: DebugManager_1.logLocation + filename + '.log' })
        ];
    }
}
exports.LoggerOptions = LoggerOptions;
exports.demoReadingLoggerOpts = new LoggerOptions('demos_reading');
exports.errorsLoggerOpts = new LoggerOptions('errors');
exports.demoReadingLoggerOpts.format = exports.demoFormat;
exports.errorsLoggerOpts.format = exports.errorsFormat;
//# sourceMappingURL=LoggerOptions.js.map