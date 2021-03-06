import * as winston from 'winston'
import { loggers, errorsLogger, debugMode } from './DebugManager';
import { ErrorTemplate } from '../Errors/Errors';

export class Logger {

    public name: string
    public loggers: winston.Logger[]

    constructor(name: string) {
        this.name = name;
        this.loggers = findLoggers(this.name)
    }

    debug(message: any) {
        if (this.loggers.length > 0) {
            this.loggers.forEach(logger => logger.info({from: this.name, message }));
        }
    }

    error(error: ErrorTemplate, content?: any) {
        if (debugMode) { console.error(error) }
        errorsLogger.logger.info({from: this.name, error: error.name, message: content})
    }
}

function findLoggers(name: string): winston.Logger[] {
    const res: winston.Logger[] = [];

    loggers.forEach(val => {
        if (val.isComponent(name)) {
            res.push(val.logger)
        }
    })

    return res
}
