import * as winston from 'winston'
import { demoReadingLoggerOpts, LoggerOptions, consoleFormat } from './LoggerOptions';

export const logLocation = (__dirname + '/logs/');
const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');
export let debugMode: boolean = false;

if (process.env.NODE_ENV === 'test') {
    debugMode =  true;
}

class LoggerService {

    public name: string
    public components: string[]
    public logger: winston.Logger

    constructor(name: string, components: string[], logger: winston.Logger) {
        this.name = name;
        this.components = components;
        this.logger = logger
    }

    isComponent(name: string) {
        if (this.components.includes(name)) {
            return true
        }
    }
}

const mainLogger = new LoggerService(
    'main',
    ['cron', 'db', 'demo_manager', 'hltv', 'mail', 'twitch'],
    winston.createLogger(new LoggerOptions('main'))
);

const serverLogger = new LoggerService(
    'server',
    ['http', 'sockets'],
    winston.createLogger(new LoggerOptions('server'))
);

const demosLogger = new LoggerService(
    'demos',
    ['demo_manager', 'demo_reader'],
    winston.createLogger(new LoggerOptions('demos'))
);

export const demoReadingLogger = new LoggerService(
    'demos_reading',
    [],
    winston.createLogger(demoReadingLoggerOpts)
);

export const loggers = [mainLogger, serverLogger, demosLogger, demoReadingLogger];

if (debugMode) {
    mainLogger.logger.add(new winston.transports.Console({
        format: consoleFormat,
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
    }))
}