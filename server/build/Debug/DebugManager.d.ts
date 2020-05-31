export declare const logLocation = "./logs/";
import * as winston from 'winston';
export declare let debugMode: boolean;
declare class LoggerService {
    name: string;
    components: string[];
    logger: winston.Logger;
    constructor(name: string, components: string[], logger: winston.Logger);
    isComponent(name: string): true | undefined;
}
export declare const errorsLogger: LoggerService;
export declare const demoReadingLogger: LoggerService;
export declare const loggers: LoggerService[];
export {};
