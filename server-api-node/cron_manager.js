/* eslint-disable no-async-promise-executor */
var CronJob = require('cron').CronJob;

// Files
var demoManager = require("./demo_manager.js");
var dbManager = require("./database_manager.js");
var hltvManager = require("./hltv_manager.js");
var debugManager = require("./debug_manager.js");
const logger = new debugManager.logger("Cron");

// Cron tasks
var job = new CronJob('*/30 * * * *', async function() {
    logger.debug('Starting task');
    await hltvManager.getLastMatches();
    
    let lastMatchId = await dbManager.lastUndownloadedMatch();
    logger.debug("Last undownloaded match : " + lastMatchId);

    lastMatchId == 0 ? checkUnavailableMatch() : cronTask(lastMatchId);
});


async function cronTask(matchId) {

    if ((await dbManager.matchHasDemos(matchId)) == false) {
        logger.debug("Match " + matchId + " has no demoId");

        let update = await demoManager.updateMatchInfos(matchId);

        if (update == 3) {
            logger.debug("Last match is currently not available, trying again");
            let lastMatchId = await dbManager.lastUndownloadedMatch();
            cronTask(lastMatchId);
            return false;
        }

        logger.debug("Match updated successfully");
    }

    if ((await dbManager.isMatchDowloaded(matchId)) == 0) {
        await demoManager.dowloadDemos(matchId);
    }

    let mapsCount = await dbManager.countMaps(matchId);

    for (let mapId = 1; mapId < mapsCount + 1; mapId++) {
        await demoManager.parseDemo(matchId, mapId);
    }
}

async function checkUnavailableMatch() {
    return new Promise(async(resolve) => {
        let lastUnavailable = await dbManager.lastUnavailableMatch();

        if (lastUnavailable == false) {
            resolve(false)
        } else {
            let update = await demoManager.updateMatchInfos(lastUnavailable.match_id);

            if (update.available == 0) {
                cronTask(lastUnavailable.match_id);
            } else {
                if (update == 3) {
                    let today = Date.now()
                    let matchDate = await parseInt(dbManager.findMatchDate(lastUnavailable.match_id));

                    if (today - matchDate > 172800000) { // 172800000 is 2 days in ms
                        await dbManager.updateMatchStatus(lastUnavailable.match_id, 4);
                    }

                    resolve(false);
                }
            }
        }
    });
}

exports.cronJob = job;