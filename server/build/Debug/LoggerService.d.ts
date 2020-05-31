import * as winston from 'winston';
import { ErrorTemplate } from '../Errors/Errors';
export declare class Logger {
    name: string;
    loggers: winston.Logger[];
    constructor(name: string);
    debug(message: any): void;
    error(error: ErrorTemplate, content?: any): void;
}
