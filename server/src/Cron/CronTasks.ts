import * as cron from 'cron'
const CronJob = cron.CronJob;

// Files
import * as hltvMngr from '../HLTV/HLTVManager'
import * as dbMngr from '../Database/DatabaseManager'
import * as demoMngr from '../Demos/Manager/DemoManager'
import { Logger } from '../Debug/LoggerService';
const logger = new Logger("cron");

// Cron tasks
export const lastMatchesTask = new CronJob('*/30 * * * *', async() => {
    logger.debug('Starting last matches task');
    await hltvMngr.getLastMatches();

    const lastMatchId = await dbMngr.lastUndownloadedMatch();
    logger.debug("Last undownloaded match : " + lastMatchId);

    lastMatchId === 0 ? checkUnavailableMatch() : updateMatch(lastMatchId);
});

async function updateMatch(matchId: number) {

    if ((await dbMngr.matchHasDemos(matchId)) === false) {
        logger.debug("Match " + matchId + " has no demoId");

        const update = await demoMngr.updateMatchInfos(matchId);

        if (update === 3) {
            logger.debug("Last match is currently not available, trying again");
            const lastMatchId = await dbMngr.lastUndownloadedMatch();
            updateMatch(lastMatchId);
            return false;
        }

        logger.debug("Match updated successfully");
    }

    if ((await dbMngr.isMatchDowloaded(matchId)) === 0) {
        try {
            await demoMngr.dowloadDemos(matchId);
        } catch (err) {
            logger.debug('Error during the download of the demos for match ' + matchId)
            return;
        }
    }

    const mapsCount = await dbMngr.countMaps(matchId);

    for (let mapId = 1; mapId < mapsCount + 1; mapId++) {
        try {
            await demoMngr.parseDemo(matchId, mapId);
        } catch(err) {
            logger.debug('Error during the parsing of the map ' + mapId + ' for match ' + matchId)
        }
    }
}

async function checkUnavailableMatch() {
    const lastUnavailable = await dbMngr.lastUnavailableMatch();

    if (lastUnavailable === null) {
        return false
    } else {
        const update = await demoMngr.updateMatchInfos(lastUnavailable.id);

        if (update === 0) {
            updateMatch(lastUnavailable.id);
            return
        } else {
            if (update === 3) {
                const today = Date.now()
                const matchDate = await Number(dbMngr.findMatchDate(lastUnavailable.id));

                if (today - matchDate > 172800000) { // 172800000 is 2 days in ms
                    await dbMngr.updateMatchStatus(lastUnavailable.id, 4);
                }

                return false
            }
        }
    }
}