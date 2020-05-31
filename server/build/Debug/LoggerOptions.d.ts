import * as winston from 'winston';
import { FileTransportInstance } from "winston/lib/winston/transports";
export declare const consoleFormat: import("logform").Format;
export declare const fileFormat: import("logform").Format;
export declare const errorsFormat: import("logform").Format;
export declare const demoFormat: import("logform").Format;
export declare class LoggerOptions implements winston.LoggerOptions {
    format: any;
    transports: FileTransportInstance[];
    constructor(filename: string);
}
export declare const demoReadingLoggerOpts: LoggerOptions;
export declare const errorsLoggerOpts: LoggerOptions;
