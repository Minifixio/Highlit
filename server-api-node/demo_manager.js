/* eslint-disable no-async-promise-executor */

// Imports
const fs = require("fs");
const request = require('request');
const util = require("util");
const { unrar } = require('unrar-promise');

// Files
var demoReader = require("./demo_reader.js");
var dbManager = require("./database_manager.js");
var hltvManager = require("./hltv_manager.js");
var twitchManager = require("./twitch_manager.js");
var socketManager = require("./socket_manager.js");
var debugManager = require("./debug_manager.js");
const logger = new debugManager.Logger("demo_manager");

// Promisify
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rmdir);

async function addMatchInfos(matchId) {
    logger.debug("Adding match")

    return new Promise(async(resolve) => {
        const hltvInfos = await hltvManager.hltvMatchInfos(matchId);

        await dbManager.addMatchInfos(hltvInfos);

        const twitchStreams = hltvInfos.twitchStreams;
        const mapsCount = hltvInfos.maps.length;

        await makeTwitchJSONfile(matchId, twitchStreams, mapsCount);

        await dbManager.updateMapStatus(matchId, 0, 0);
        resolve(hltvInfos.available);
    });
}

async function updateMatchInfos(matchId) {
    return new Promise(async(resolve) => {
        const hltvInfos = await hltvManager.hltvMatchInfos(matchId);

        if(hltvInfos.id) { // Is the match valid ?
            await dbManager.updateMatchInfos(hltvInfos);
            const twitchStreams = hltvInfos.twitchStreams;
            hltvInfos.maps.length > 0 ? await makeTwitchJSONfile(matchId, twitchStreams, hltvInfos.maps.length): null;
        }

        resolve(hltvInfos.available);
    })
}

async function findMatchInfos(matchId, mapNumber) {
    return new Promise (async(resolve) => {
        let path = await findMatchPath(matchId);
        const matchJSONfile = require(`${path}/${matchId}-map${mapNumber}.json`);
        const twitchJSONfile = require(`${path}/twitch_infos.json`);

        if (mapNumber == 1) {
            var twitchLink = twitchJSONfile.map1[0].link;
        } else {
            twitchLink = twitchJSONfile["map" + mapNumber][0].link;
        }

        const twitchLinkParsed = hltvManager.parseTwitchLink(twitchLink);

        const response = {
            matchId: matchId,
            videoId: twitchLinkParsed.videoId,
            startVideoTime: twitchLinkParsed.startVideoTime,
            roundInfos: matchJSONfile
        }

        resolve(response);
    })
}

async function dowloadDemos(matchId) {
    return new Promise(async function(resolve, reject) {

        // Get the demo id to download the demo files
        let demoId = await dbManager.getMatchDemoId(matchId);
        logger.debug('Download demos for match ' + matchId + ' demo id is : ' + demoId);

        // Updating match/map status to 2 meaning they are being downloaded
        await dbManager.updateMapStatus(matchId, 0, 2);
        await dbManager.updateMatchStatus(matchId, 2);

        // Find the match folder's path
        let path = await findMatchPath(matchId);

        // URL of the match demos from HLTV
        var file_url = 'http://www.hltv.org/download/demo/' + demoId;

        downloadFile(file_url, `${path}/${matchId}.rar`).then(async() => {
            logger.debug('Finished download for demo ' + matchId);

            // Unrar the file
            await unrar(`${path}/${matchId}.rar`, `${path}/dem`,);
            logger.debug('Finished unrar for demo ' + matchId);
    
            // Delete the .rar file
            await unlink(`${path}/${matchId}.rar`);
    
            // Updating map status to 0 meaning they are downloaded but not parsed yet
            await dbManager.updateMapStatus(matchId, 0, 0);
    
            // Updating match status to 1 meaning the demos are now downloaded
            await dbManager.updateMatchStatus(matchId, 1);
            resolve();

        }).catch((err) => {
            reject(err)
        })


        /**
        // The file where we will write the datas
        var out = fs.createWriteStream(`${path}/${matchId}.rar`);
    
        var contentLength;
        var length = [];
        let lastCompletedPercentage = 0;
    
        // A new get request
        var req = request({
            method: 'GET',
            uri: file_url
        });

        // Pass the request to the writable file
        req.pipe(out);

        // Get the content lenght to compute the download percentage
        req.on('response', function (data) {
            contentLength = parseInt(data.headers['content-length']);
        });

        req.on('data', function (chunk) {
            length.push(chunk.length);
            let sum = length.reduce((a, b) => a + b, 0);
            let completedPercentage = Math.round((sum / contentLength) * 100);
            if (completedPercentage !== lastCompletedPercentage) {
                completedPercentage % 10 == 0 ? logger.debug(`${completedPercentage} % of download complete`): null;
                //socketManager.socketEmit('select-map', {type: 'downloading', match_id: matchId, params: completedPercentage});
                lastCompletedPercentage = completedPercentage;
            }
        });

        req.on('end', async function() {
            logger.debug('Finished download for demo ' + matchId);

            // Unrar the file
            await unrar(`${path}/${matchId}.rar`, `${path}/dem`,);
            logger.debug('Finished unrar for demo ' + matchId);

            // Delete the .rar file
            await unlink(`${path}/${matchId}.rar`);

            // Updating map status to 0 meaning they are downloaded but not parsed yet
            await dbManager.updateMapStatus(matchId, 0, 0);

            // Updating match status to 1 meaning the demos are now downloaded
            await dbManager.updateMatchStatus(matchId, 1);
            resolve();
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(e)
        });**/
    })
}

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        var contentLength;
        var length = [];
        let lastCompletedPercentage = 0;
        const file = fs.createWriteStream(dest);
        const sendReq = request.get(url);

        sendReq.on('response', (response) => {
            contentLength = parseInt(response.headers['content-length']);
            if (response.statusCode !== 200) {
                reject('Response status was ' + response.statusCode)
            }
        });

        sendReq.on('data', function (chunk) {
            length.push(chunk.length);
            let sum = length.reduce((a, b) => a + b, 0);
            let completedPercentage = Math.round((sum / contentLength) * 100);
            if (completedPercentage !== lastCompletedPercentage) {
                completedPercentage % 10 == 0 ? logger.debug(`${completedPercentage} % of download complete`): null;
                //socketManager.socketEmit('select-map', {type: 'downloading', match_id: matchId, params: completedPercentage});
                lastCompletedPercentage = completedPercentage;
            }
        });

        sendReq.on('error', (err) => {
            fs.unlink(dest);
            reject(err)
        });

        sendReq.pipe(file);

        file.on('finish', () => {
            file.close();
            resolve()
        });

        file.on('error', (err) => {
            fs.unlink(dest);
            reject(err)
        });
    })
}

async function parseDemo(matchId, mapNumber) {
    return new Promise (async(resolve, reject) => {

        // fs readdir util to read folder's content
        const readdir = util.promisify(fs.readdir);

        // Updating map status to 2 meaning the map is being downloaded
        await dbManager.updateMapStatus(matchId, mapNumber, 2);

        logger.debug('Parsing demo for match ' + matchId + ' map ' + mapNumber);

        // Get the path of the match folder
        let path = await findMatchPath(matchId);

        // Find all the .dem files (because sometimes .DS_STORE files corrupt the process)
        var result = await (await readdir(`${path}/dem`)).filter(file => file.includes('.dem'));
        var map = '';
    
        // If there is only one map, the result is the only file present
        if (mapNumber == 1 && result.length == 1) { 
            map = result[0]; 

        // Else we look for the right file. Files are always built like team1_name-vs-team2_name-m{map_number}-{map_name}
        } else {
            let scope = `-m${mapNumber}-`;
            result.forEach(mapName => {
                if (mapName.includes(scope)) {
                    map = mapName;
                }
            })
        }

        if (map == null || result.length == 0) {
            logger.debug('dem file for map ' + map + ' not availablefor match : '  + matchId);
            await dbManager.updateMapStatus(matchId, mapNumber, 3);
            reject('dem file not available')
            return;
        }

        logger.debug('Map to parse is : ' + map)

        // Find the amount of rounds played for the demo reader
        let roundsPlayed = await findMapRoundsPlayed(matchId, mapNumber);

        // New instance of demo reader
        let reader = new demoReader.DemoReader(`${path}/dem/${map}`, matchId, roundsPlayed);

        // Init roundInfos as empty first
        let roundInfos = []

        // Awaiting for the read function to process
        try {
            roundInfos = await reader.read()
        } catch(e) {
            logger.debug('Wrong parsing for map : ' + map + " for match : " + matchId);
            await dbManager.updateMapStatus(matchId, mapNumber, 3);
            reject(e)
            return
        }

        logger.debug('Good parsing for map : ' + map + " for match : " + matchId);

        // Computing a rating for each round based on average viewers during the livestream of the match
        // TODO : Make a function to test if twitch comments are available or no
        roundInfos = await twitchManager.calculateTwitchRating(roundInfos, path, mapNumber);

        // Making the match JSON file
        try {
            await makeMatchJSONfile(matchId, mapNumber, roundInfos);
        } catch(e) {
            logger.debug('error when creating the match JSON file')
            reject(e)
            return;
        }

        // Updating map status to 1 meaning the map is now available
        await dbManager.updateMapStatus(matchId, mapNumber, 1);

        // Deleting the dem file (really heavy files)
        try {
            await unlink(`${path}/dem/${map}`); 
        } catch(e) {
            logger.debug('error when deleting the dem file')
            reject(e)
            return;
        }

        // If the dem file was the last one in the demos folder, we make sure to delete any left files and then delete the /dem folder
        if (result.length == 1) {
            let leftFiles = await readdir(`${path}/dem/`);

            leftFiles.forEach(async(f) => {
                await unlink(`${path}/dem/${f}`);
            });

            await rmdir(`${path}/dem`);
        }

        resolve()
    })
}

async function makeMatchJSONfile(matchId, mapNumber, roundInfos) {
    return new Promise(async(resolve, reject) => {
        // Find the folder's path
        let path = await findMatchPath(matchId);

        // Create the JSON file
        const output = JSON.stringify(roundInfos);
        writeFile(`${path}/${matchId}-map${mapNumber}.json`, output, 'utf8').then(() => {
            logger.debug('Match JSON created for match ' + matchId + ' map n°' + mapNumber);
            resolve(1);
        }).catch(e => {
            reject(e)
        });
    })
}

// Get all the available stream links on the match page and attributes them a corresponding map
async function makeTwitchJSONfile(matchId, links, mapsCount) {
    return new Promise(async(resolve, reject) => {
        const mapsLinks = {};

        // If there is only one map, all the available links are for this map
        if (mapsCount == 1) {
            mapsLinks["map1"] = links;

        // If not, we search for the matching stream links. The link contain the map name like 'Map {map_number}'
        } else {
           for(let i = 1; i < (mapsCount + 1); i++) {
               let scope = links.filter(obj => obj.name.includes('Map ' + i));
               mapsLinks["map" + i] = scope;
           }
        }

        // Find the match folder's path
        let path = await findMatchPath(matchId);

        // Make the JSON file
        const output = JSON.stringify(mapsLinks);
        writeFile(`${path}/twitch_infos.json`, output, 'utf8').then(() => {
            logger.debug('Twitch JSON created');
            resolve();
        }).catch(e => {
            reject(e)
        });
    })
}

async function findMatchPath(matchId) {
    return new Promise(async(resolve) => {
        let date = new Date(await dbManager.findMatchDate(matchId));

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
    
        let path = `./matches/${year}`;
    
        if (!fs.existsSync(path)) {
            await mkdir(path);
        }
    
        path = `./matches/${year}/${month}`;
    
        if (!fs.existsSync(path)) {
            await mkdir(path);
        }
    
        path = `./matches/${year}/${month}/${day}`;
    
        if (!fs.existsSync(path)) {
            await mkdir(path);
        }

        path = `./matches/${year}/${month}/${day}/${matchId}`;
    
        if (!fs.existsSync(path)) {
            await mkdir(path);
        }
    
        resolve(path);
    })
}

async function findMapRoundsPlayed(matchId, mapNumber) {
    return new Promise(async(resolve) => {
        let score = await dbManager.findMapScore(matchId, mapNumber);

        score = score.substring(0, 5).split(":").map(e => parseInt(e)).reduce((a, b) => a + b);
    
        resolve(score);
    })
}

// Exports
module.exports.findMatchPath = findMatchPath;
module.exports.parseDemo = parseDemo;
module.exports.findMatchInfos = findMatchInfos;
module.exports.addMatchInfos = addMatchInfos;
module.exports.updateMatchInfos = updateMatchInfos;
module.exports.dowloadDemos = dowloadDemos;