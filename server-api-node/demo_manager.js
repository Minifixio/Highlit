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
var httpManager = require("./http_manager.js");
var twitchManager = require("./twitch_manager.js");
var socketManager = require("./socket_manager.js");
var debugManager = require("./debug_manager.js");
const logger = new debugManager.logger("DemoManager");

// Promisify
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rmdir);

exports.addMatchInfos = async function addMatchInfos(matchId) {
    logger.debug("Adding match")

    return new Promise(async(resolve) => {
        const hltvInfos = await hltvManager.hltvMatchInfos(matchId);
        await dbManager.addMatchInfos(hltvInfos);

        const twitchStreams = hltvInfos.twitchStreams;
        const mapsCount = hltvInfos.maps.length;

        await makeTwitchJSONfile(matchId, twitchStreams, mapsCount);

        await dbManager.updateMapStatus(matchId, 0, 'no');
        resolve(1);
    });
}

exports.updateMatchInfos = async function updateMatchInfos(matchId) {
    return new Promise(async(resolve) => {
        const hltvInfos = await hltvManager.hltvMatchInfos(matchId);
        
        if (hltvInfos == 'demos_not_available') {
            resolve('demos_not_available');
        } 
        if(hltvInfos == 'match_not_available') {
            resolve('match_not_available');
        } 
        if(hltvInfos.match_id) { // Is the match valid ?
            await dbManager.updateMatchInfos(hltvInfos);
            const twitchStreams = hltvInfos.twitchStreams;
            await makeTwitchJSONfile(matchId, twitchStreams, hltvInfos.maps.length);
            resolve(true);
        }
    })
}

exports.findMatchInfos = async function findMatchInfos(matchId, mapNumber) {
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
            videoId: twitchLinkParsed.videoId,
            startVideoTime: twitchLinkParsed.startVideoTime,
            roundInfos: matchJSONfile
        }

        resolve(response);
    })
}

exports.dowloadDemos = async function dowloadDemos(matchId) {
    return new Promise(async function(resolve) {

        let demoId = await dbManager.getMatchDemoId(matchId);
        logger.debug('Download demos for match ' + matchId + ' demo id is : ' + demoId);
        await dbManager.updateMapStatus(matchId, 0, 'downloading');
        await dbManager.updateMatchStatus(matchId, 2);

        let path = await findMatchPath(matchId);
        var file_url = 'http://www.hltv.org/download/demo/' + demoId;

        var out = fs.createWriteStream(`${path}/${matchId}.rar`);
    
        var contentLength;
        var length = [];
        let lastCompletedPercentage = 0;
    
        var req = request({
            method: 'GET',
            uri: file_url
        });
        req.pipe(out);
        req.on( 'response', function ( data ) {
            contentLength = parseInt(data.headers['content-length']);
        });
        req.on('data', function (chunk) {
            length.push(chunk.length);
            let sum = length.reduce((a, b) => a + b, 0);
            let completedPercentage = Math.round((sum / contentLength) * 100);
            if (completedPercentage !== lastCompletedPercentage) {
                logger.debug(`${completedPercentage} % of download complete`);
                socketManager.socketEmit('select-map', {type: 'downloading', params: completedPercentage});
                lastCompletedPercentage = completedPercentage;
            }
        });
        req.on('end', async function() {
            logger.debug('Finished download for demo ' + matchId);
            await unrar(`${path}/${matchId}.rar`, `${path}/dem`,);
            logger.debug('Finished unrar for demo ' + matchId);
            await unlink(`${path}/${matchId}.rar`);

            await dbManager.updateMapStatus(matchId, 0, 'no');
            await dbManager.updateMatchStatus(matchId, 1);
            resolve(1);
        });
    })
}

exports.parseDemo = async function parseDemo(matchId, mapNumber) {
    return new Promise (async(resolve) => {
        await dbManager.updateMapStatus(matchId, mapNumber, 'parsing');
        logger.debug('Parsing demo for match ' + matchId + ' map ' + mapNumber);
        let path = await findMatchPath(matchId);
        const readdir = util.promisify(fs.readdir);
        var result = await (await readdir(`${path}/dem`)).filter(file => file.includes('.dem'));
        var map = '';
    
        if (mapNumber == 1 && result.length == 1) { // If there is only one map
            map = result[0]; 
        } else {
            let scope = `-m${mapNumber}-`;
            result.forEach(mapName => {
                if (mapName.includes(scope)) {
                    map = mapName;
                }
            })
        }
        logger.debug('Map to parse is : ' + map)
        var roundInfos = await demoReader.readDemo(`${path}/dem/${map}`, matchId);

        // TODO : Make a function to test if twitch comments are available or no
        roundInfos = await twitchManager.calculateTwitchRating(roundInfos, path, mapNumber);

        await makeMatchJSONfile(matchId, mapNumber, roundInfos);
        await dbManager.updateMapStatus(matchId, mapNumber, 'yes');
        await unlink(`${path}/dem/${map}`); // Delete dem file

        if (result.length == 1) {
            let leftFiles = await readdir(`${path}/dem/`);

            leftFiles.forEach(async(f) => {
                await unlink(`${path}/dem/${f}`);
            });

            await rmdir(`${path}/dem`);
        }

        resolve(1);
    })
}

async function makeMatchJSONfile(matchId, mapNumber, roundInfos) {
    return new Promise(async(resolve) => {
        let path = await findMatchPath(matchId);
        const output = JSON.stringify(roundInfos);
        writeFile(`${path}/${matchId}-map${mapNumber}.json`, output, 'utf8').then(() => {
            logger.debug('Match JSON created for match ' + matchId + ' map n°' + mapNumber);
            resolve(1);
        });
    })
}

async function makeTwitchJSONfile(matchId, links, mapsCount) {
    return new Promise(async(resolve) => {
        const mapsLinks = {};
        if (mapsCount == 1) {
            mapsLinks["map1"] = links;
        } else {
           for(let i = 1; i < (mapsCount + 1); i++) {
               let scope = links.filter(obj => obj.name.includes('Map ' + i));
               mapsLinks["map" + i] = scope;
           }
        }

        let path = await findMatchPath(matchId);
        if (!fs.existsSync(path)) {
            await mkdir(path);
        }
        const output = JSON.stringify(mapsLinks);
        writeFile(`${path}/twitch_infos.json`, output, 'utf8').then(() => {
            logger.debug('Twitch JSON created');
            resolve(1);
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

exports.makeFoldersMigration = async function makeFoldersMigration() {
    let matches = await dbManager.getAllMatches();

    matches.forEach(async(match) => {
        await findMatchPath(match.match_id)
    })
}