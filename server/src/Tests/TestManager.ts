import * as cronTasks from '../Cron/CronTasks'
import { Logger } from '../Debug/LoggerService';
import * as dbMngr from '../Database/DatabaseManager'
import * as hltvMngr from '../HLTV/HLTVManager'
const logger = new Logger("test");

export async function triggerCron() {
    logger.debug('Starting last matches task');
    await hltvMngr.getLastMatches();

    const lastMatchId = await dbMngr.lastUndownloadedMatch();
    logger.debug("Last undownloaded match : " + lastMatchId);

    lastMatchId === 0 ? cronTasks.checkUnavailableMatch() : cronTasks.updateMatch(lastMatchId);
}
