/* eslint-disable no-async-promise-executor */

/**
 * Imports
 */
const fs = require("fs");
const request = require('request');
const util = require("util");
const { unrar } = require('unrar-promise');
var demoReader = require("./demo_reader.js");
var dbManager = require("./database_manager.js");
var hltvManager = require("./hltv_manager.js");
var httpManager = require("./index.js");
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);

exports.addMatchInfos = async function addMatchInfos(matchId) {
    console.log("[addMatchInfos] Adding match")

    return new Promise(async(resolve) => {
        const hltvInfos = await hltvManager.hltvMatchInfos(matchId);
        await dbManager.addMatchInfos(hltvInfos);

        const twitchStreams = hltvInfos.twitchStreams;
        //const demoId = hltvInfos.demoId;
        const mapsCount = hltvInfos.maps.length;

        //await dbManager.updateMapStatus(matchId, 0, 'downloading');
        //await dowloadDemos(demoId, matchId);
        await makeTwitchJSONfile(matchId, twitchStreams, mapsCount);

        //await dbManager.updateMatchInfos(matchId, 1); // 1 equals to available
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
        let path = `./matches/${matchId}`;
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
        console.log('[dowloadDemos] Download demos for match ' + matchId + ' demo id is : ' + demoId);
        await dbManager.updateMapStatus(matchId, 0, 'downloading');

        let path = `./matches/${matchId}`;
        var file_url = 'http://www.hltv.org/download/demo/' + demoId;
        if (!fs.existsSync(path)) {
            await mkdir(path);
        }
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
                console.log(`[dowloadDemos] ${completedPercentage} % of download complete`);
                httpManager.socketEmit('select-map', {type: 'downloading', params: completedPercentage});
                lastCompletedPercentage = completedPercentage;
            }
        });
        req.on('end', async function() {
            console.log('[dowloadDemos] Finished download for demo ' + matchId);
            await unrar(`${path}/${matchId}.rar`, `${path}/dem`,);
            console.log('[dowloadDemos] Finished unrar for demo ' + matchId);
            await unlink(`${path}/${matchId}.rar`);

            await dbManager.updateMapStatus(matchId, 0, 'no');
            resolve(1);
        });
    })
}

exports.parseDemo = async function parseDemo(matchId, mapNumber) {
    return new Promise (async(resolve) => {
        await dbManager.updateMapStatus(matchId, mapNumber, 'parsing');
        console.log('[parseDemo] Parsing demo for match ' + matchId + ' map ' + mapNumber);
        let path = `./matches/${matchId}`;
        const readdir = util.promisify(fs.readdir);
        var result = await (await readdir(`${path}/dem`)).filter(file => file.includes('.dem'));
        var map = '';
    
        if (mapNumber == 1) { // If there is only one map
            map = result[0]; 
        } else {
            let scope = `-m${mapNumber}-`;
            result.forEach(mapName => {
                if (mapName.includes(scope)) {
                    map = mapName;
                }
            })
        }
        console.log('[parseDemo] Map to parse is : ' + map)
        const matchInfos = await demoReader.readDemo(`${path}/dem/${map}`, matchId);
        await makeMatchJSONfile(matchId, mapNumber, matchInfos);
        await dbManager.updateMapStatus(matchId, mapNumber, 'yes');
        resolve(1);
    })
}

async function makeMatchJSONfile(matchId, mapNumber, matchInfos) {
    return new Promise((resolve) => {
        let path = `./matches/${matchId}`;
        const output = JSON.stringify(matchInfos);
        writeFile(`${path}/${matchId}-map${mapNumber}.json`, output, 'utf8').then(() => {
            console.log('[parseDemo] Match JSON created for match ' + matchId + ' map n°' + mapNumber);
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

        let path = `./matches/${matchId}`;
        if (!fs.existsSync(path)) {
            await mkdir(path);
        }
        const output = JSON.stringify(mapsLinks);
        writeFile(`${path}/twitch_infos.json`, output, 'utf8').then(() => {
            console.log('[parseDemo] Twitch JSON created');
            resolve(1);
        });
    })
}