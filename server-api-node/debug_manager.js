const winston = require('winston');
const logLocation = (__dirname + '/logs/');
const { format } = require('winston');
const { combine, prettyPrint } = format;
const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');
var debugMode = true;

/**process.on('unhandledRejection', (reason) => {
    errorLogger.logger.error(reason);
    process.exit(1);
})
process.on('uncaughtException', (reason) => {
    errorLogger.logger.error(reason);
    process.exit(1);
});**/

function dateLog() {
    return new Date(Date.now()).toUTCString();
}

const consoleFormat = winston.format.printf(
                        (info) => {
                            let message =  `${dateLog()} | ${info.level.toUpperCase()} | `
                            message = info.from ? message + `FROM:${info.from} | ` : message
                            message += info.message
                            return message
                        })
                        
const fileFormat = winston.format.printf(
                        (info) => {
                            let message = {date: dateLog(), level: info.level.toLocaleUpperCase(), from: info.from, message: info.message}
                            return JSON.stringify(message)
                        })

const demoFormat = combine(
                        format.printf(
                            (info) => {
                                delete info.level; 
                                info.match = info.message;
                                info.date = dateLog()
                                delete info.message; 
                                return info;
                            }), 
                         prettyPrint())

class LoggerOptions {
    constructor(filename) {
        this.exitOnError = false;
        this.format = fileFormat;
        this.transports = [
            new winston.transports.File({ filename: logLocation + filename + '.log'})
        ];
    }
}

const demoReadingLoggerOpts = new LoggerOptions('demos_reading');
demoReadingLoggerOpts.format = demoFormat;

const errorLoggerOpts = new LoggerOptions('errors');
errorLoggerOpts.transports = [ new winston.transports.File({ filename: logLocation + 'errors.log', level: 'debug'}) ];
errorLoggerOpts.format = winston.format.json();

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

var mainLogger = new Logger(
    'main', 
    ['cron', 'db', 'demo_manager', 'hltv', 'mail', 'twitch'], 
    winston.createLogger(new LoggerOptions('main'))
);

var serverLogger = new Logger(
    'server', 
    ['http', 'sockets'], 
    winston.createLogger(new LoggerOptions('server'))
);

var demosLogger = new Logger(
    'demos', 
    ['demo_manager', 'demo_reader'], 
    winston.createLogger(new LoggerOptions('demos'))
);

var demoReadingLogger = new Logger(
    'demos_reading', 
    [], 
    winston.createLogger(demoReadingLoggerOpts)
);

/**var errorLogger = new Logger(
    'errors', 
    [],
    winston.createLogger(errorLoggerOpts)
);**/
//errorLogger.logger.exceptions.handle(new winston.transports.File({ filename: logLocation + 'errors.log' }));


const loggers = [mainLogger, serverLogger, demosLogger, demoReadingLogger];

if (debugMode) {
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

class LoggerService {
    constructor(name) {
        this.name = name;
        this.loggers = findLoggers(this.name)
    }
    debug(message) {
        if (this.loggers.length > 0) {
            this.loggers.forEach(logger => logger.info({from: this.name, message: message}));
        }
    }
}

class DemoReadingLogger {
    constructor(matchId) {
        this.matchId = matchId;
        this.matchLogsInfos = [];
    }

    roundLog(roundId, infos) {
        //console.log({type: 'round', roundId, infos})
        this.matchLogsInfos.push({type: 'round', roundId, infos})
    }

    matchLog(infos) {
        //console.log({type: 'other', infos})
        this.matchLogsInfos.push({type: 'other', infos})
    }

    endLogs() {
        demoReadingLogger.logger.info({matchId: this.matchId, matchInfos: this.matchLogsInfos});
    }
}

function findLoggers(name) {
    let res = [];

    loggers.forEach(val => {
        if (val.isComponent(name)) {
            res.push(val.logger) 
        }
    })

    return res
}

module.exports.DemoReadingLogger =  DemoReadingLogger;
module.exports.Logger = LoggerService