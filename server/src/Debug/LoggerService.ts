import * as winston from 'winston'
import { loggers } from './DebugManager';

export class Logger {

    public name: string
    public loggers: winston.Logger[]

    constructor(name: string) {
        this.name = name;
        this.loggers = findLoggers(this.name)
    }

    debug(message: string) {
        if (this.loggers.length > 0) {
            this.loggers.forEach(logger => logger.info({from: this.name, message }));
        }
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
