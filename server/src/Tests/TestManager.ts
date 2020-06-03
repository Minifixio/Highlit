import * as cronTasks from '../Cron/CronTasks'
import { Logger } from '../Debug/LoggerService';
import * as fs from 'fs'
import * as dbMngr from '../Database/DatabaseManager'
import * as hltvMngr from '../HLTV/HLTVManager'
import * as twitchMngr from '../Twitch/TwitchManager'
import * as demoMngr from '../Demos/Manager/DemoManager'

const logger = new Logger("test");

export async function triggerCron() {
    logger.debug('Starting last matches task');
    await hltvMngr.getLastMatches();

    const lastMatchId = await dbMngr.lastUndownloadedMatch();
    logger.debug("Last undownloaded match : " + lastMatchId);

    lastMatchId === 0 ? cronTasks.checkUnavailableMatch() : cronTasks.updateMatch(lastMatchId);
}

async function testTwitchRating() {
    const path = await demoMngr.findMatchPath(2341778)
    console.log(path)
    const matchDatas = JSON.parse(fs.readFileSync(`./tests/jsons/test1.json`, 'utf8'));

    try {
        const res = await twitchMngr.calculateTwitchRating(matchDatas, './matches/2020/5/24/2341602', 1);
        console.log(res)
    } catch(e) {
        console.log(e)
    }
}

testTwitchRating()