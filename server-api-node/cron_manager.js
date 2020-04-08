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
    let matchId = await dbManager.lastUndownloadedMatch();

    if (matchId !== 0) {
        if ((await dbManager.matchHasDemos(matchId)) == false) {
            let update = await demoManager.updateMatchInfos(matchId);

            if (update == 'demos_not_available' || update == 'match_not_available') {
                let today = Date.now()
                let matchDate = await parseInt(dbManager.findMatchDate(matchId));

                if (today - matchDate > 172800000) { // 172800000 is 2 days in ms
                    await dbManager.updateMatchStatus(matchId, 3);
                }

                return false;
            }
        }
    
        if ((await dbManager.isMatchDowloaded(matchId)) == false) {
            await demoManager.dowloadDemos(matchId);
        }
    
        let mapsCount = await dbManager.countMaps(matchId);
    
        for (let mapId = 1; mapId < mapsCount + 1; mapId++) {
            await demoManager.parseDemo(matchId, mapId);
        }
    }
});

exports.cronJob = job;