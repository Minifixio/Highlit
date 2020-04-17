const winston = require('winston');
const logLocation = (__dirname + '/logs/');
const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');

const consoleFormat = winston.format.printf(
                        (info) => {
                            let message =  `${dateLog()} | ${info.level.toUpperCase()} | `
                            message = info.from ? message + `FROM:${info.from} | ` : message
                            message += info.message
                            return message
                        })
                        
const fileFormat = winston.format.printf(
                        (info) => {
                            let message = {level: info.level.toLocaleUpperCase(), from: info.from, message: info.message}
                            return JSON.stringify(message)
                        })

function dateLog() {
    return new Date(Date.now()).toUTCString();
}

class LoggerOptions {
    constructor(filename) {
        this.format = winston.format.json();
        this.exitOnError = false;
        this.format = fileFormat;
        this.transports = [
          new winston.transports.File({ filename: logLocation + filename + '.log', timestamp: true}),
        ];
    }
}

class Logger {
    constructor(name, components, logger) {
        this.name = name;
        this.components = components;
        this.logger = logger
    }
    
    isComponent(name) {
        if (this.components.includes(name)) {
            return true
        }
    }
}

const mainLogger = new Logger('main', [], winston.createLogger(new LoggerOptions('main')));
const serverLogger = new Logger('server', ['http', 'sockets'], winston.createLogger(new LoggerOptions('server')));
const demosLogger = new Logger('demos', ['demo_manager', 'demo_reader'], winston.createLogger(new LoggerOptions('demos')));

const loggers = [mainLogger, serverLogger, demosLogger];

if (process.env.NODE_ENV !== 'production') {
    mainLogger.logger.add(new winston.transports.Console({
        format: consoleFormat,
        log(info, callback) {
            setImmediate(() => this.emit('logged', info));
    
            if (this.stderrLevels[info[LEVEL]]) {
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

var loggerService = class loggerService {
    constructor(name) {
        this.name = name;
        this.logger = findLogger(this.name)
    }
    debug(message) {
        if (this.logger) {
            this.logger.info({from: this.name, message: message})
        }

        mainLogger.logger.info({from: this.name, message: message})
    }
}

function findLogger(name) {
    let res = null;

    loggers.forEach(val => {
        if (val.isComponent(name)) {
            res = val.logger
        }
    })

    return res
}

module.exports.loggerService = loggerService;
module.exports.find = findLogger;