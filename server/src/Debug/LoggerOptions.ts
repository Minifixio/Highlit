import * as winston from 'winston'
import { FileTransportInstance } from "winston/lib/winston/transports"
import { format } from 'winston'
import { logLocation } from './DebugManager';
const { combine, prettyPrint } = format;

function dateLog() {
    return new Date(Date.now()).toUTCString();
}

export const consoleFormat = winston.format.printf(
    (info) => {
        let message =  `${dateLog()} | ${info.level.toUpperCase()} | `
        message = info.from ? message + `FROM:${info.from} | ` : message
        message += info.message
        return message
    })

export const fileFormat = winston.format.printf(
    (info) => {
        const message = {date: dateLog(), level: info.level.toLocaleUpperCase(), from: info.from, message: info.message}
        return JSON.stringify(message)
    })

export const demoFormat = combine(
    format.printf(
        (info) => {
            delete info.level;
            info.match = info.message;
            info.date = dateLog()
            delete info.message;
            return JSON.stringify(info);
        }),
     prettyPrint())

export class LoggerOptions implements winston.LoggerOptions {

    public format: any;
    public transports: FileTransportInstance[]

    constructor(filename: string) {
        this.format = fileFormat;
        this.transports = [
            new winston.transports.File({ filename: logLocation + filename + '.log'})
        ];
    }
}

export const demoReadingLoggerOpts = new LoggerOptions('demos_reading');
demoReadingLoggerOpts.format = demoFormat;