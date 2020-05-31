import * as cron from 'cron';
export declare const lastMatchesTask: cron.CronJob;
export declare function updateMatch(matchId: number): Promise<false | undefined>;
export declare function checkUnavailableMatch(): Promise<false | undefined>;
