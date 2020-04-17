const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const logLocation = (__dirname + '/logs/');

const consoleFormat = winston.format.printf(
                        (info) => {
                            let message =  `${dateLog()} | ${info.level.toUpperCase()} | `
                            message = info.name ? message + `FROM:${info.name} | ` : message
                            message += info.message
                            return message
                        })
                        
const fileFormat = winston.format.printf(
                        (info) => {
                            let message = {level: info.level.toLocaleUpperCase(), from: info.name, message: info.message}
                            return JSON.stringify(message)
                        })

function dateLog() {
    return new Date(Date.now()).toUTCString();
}

class opts {
    constructor(filename) {
        this.format = winston.format.json();
        this.exitOnError = false;
        this.format = fileFormat;
        this.transports = [
          new winston.transports.File({ filename: logLocation + filename + '.log', timestamp: true}),
        ];
    }

}

const mainLogger = winston.createLogger(new opts('main'));
const serverLogger = winston.createLogger(new opts('server'));
const demosLogger = winston.createLogger(new opts('demos'));

const loggers = {
    server: {
        logger: serverLogger,
        components: ['http', 'sockets']
    },

    demos: {
        logger: demosLogger,
        components: ['demo_manager', 'demo_reader']
    },

    main: {
        logger: mainLogger
    }
}

if (process.env.NODE_ENV !== 'production') {
    loggers.main.logger.add(new winston.transports.Console({
        format: consoleFormat,
        timestamp: true
    }))
}

var logger = class Logger {
    constructor(name) {
        this.name = name;
    }
    debug(message) {
        if (findLogger(this.name)) {
            const logger = findLogger(this.name);
            logger.info({from: this.name, message: message})
        }

        loggers.main.logger.info({from: this.name, message: message})
    }
}

function findLogger(name) {
    for (let key of Object.keys(loggers)) {
        if(loggers[key].components.includes(name) && loggers[key].components) {
            return loggers[key].logger
        } else {
            return null;
        }
    }
}

module.exports.logger = logger;