export const logLocation = ('./logs/');
import * as winston from 'winston'
import { demoReadingLoggerOpts, LoggerOptions, consoleFormat, errorsLoggerOpts } from './LoggerOptions';

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
    ['cron', 'db', 'demo_manager', 'hltv', 'mail', 'twitch', 'app', 'test'],
    winston.createLogger(new LoggerOptions('main'))
);

const serverLogger = new LoggerService(
    'server',
    ['http', 'sockets', 'app'],
    winston.createLogger(new LoggerOptions('server'))
);

const demosLogger = new LoggerService(
    'demos',
    ['demo_manager', 'demo_reader'],
    winston.createLogger(new LoggerOptions('demos'))
);

export const errorsLogger = new LoggerService(
    'errors',
    [],
    winston.createLogger(errorsLoggerOpts)
);

export const demoReadingLogger = new LoggerService(
    'demos_reading',
    [],
    winston.createLogger(demoReadingLoggerOpts)
);

export const loggers = [mainLogger, serverLogger, demosLogger, demoReadingLogger, errorsLogger];

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