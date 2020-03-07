/* eslint-disable no-async-promise-executor */

/**
 * Imports
 */
const fs = require("fs");
const request = require('request');
const { HLTV } = require('hltv')
const util = require("util");
const { unrar } = require('unrar-promise');
var demoReader = require("./demo_reader.js");
const writeFile = util.promisify(fs.writeFile);

exports.findDemoInfos = async function findMatchInfos(matchId, mapNumber) {

    return new Promise (async(resolve) => {
        let path = `./matches/${matchId}`;
        if( !(fs.existsSync(path)) ) {
            console.log('[findDemoInfos] Folder doesnt exist');
            const hltvInfos = await hltvMatchInfos(matchId);
            const twitchStreams = hltvInfos.twitchStreams;
            const demoId = hltvInfos.demoId;

            await dowloadDemos(demoId, matchId);
            await makeTwitchJSONfile(matchId, twitchStreams);
            await parseDemos(matchId, mapNumber);
        } else {
            console.log('[findDemoInfos] Folder already exists');
            const readdir = util.promisify(fs.readdir);
            var result = await (await readdir(path)).filter(file => file.includes('map' + mapNumber));

            if (result.length == 0) {
                await parseDemos(matchId, mapNumber);
            } else {
                console.log('[findDemoInfos] JSON already exists');
            }
        }

        const matchJSONfile = require(`${path}/${matchId}-map${mapNumber}.json`);
        const twitchJSONfile = require(`${path}/twitch_infos.json`);

        if (twitchJSONfile.length == 1) {
            var twitchLink = twitchJSONfile[0].link;
        } else {
            twitchLink = twitchJSONfile.filter(obj => obj.includes('Map ' + mapNumber))[0].link
        }

        const twitchLinkParsed = parseTwitchLink(twitchLink);

        const response = {
            videoId: twitchLinkParsed.videoId,
            startVideoTime: twitchLinkParsed.startVideoTime,
            roundInfos: matchJSONfile
        }
        console.log(response);
        resolve(response);
    })

}

async function hltvMatchInfos(matchId) {
    console.log('[findDemoId] Looking for informations for match ' + matchId);
    return new Promise(async (resolve) => {
        var matchInfos = await HLTV.getMatch({id: matchId});
        const downloadLink = matchInfos.demos.filter(obj => obj.name.includes('GOTV'))[0].link;
        const demoId = downloadLink.match(/(\d+)/)[0];
        const twitchStreams = matchInfos.demos.filter(obj => obj.link.includes('twitch'));

        const response = {
            twitchStreams: twitchStreams,
            demoId: demoId
        }
        resolve(response);
    })
}

async function dowloadDemos(demoId, matchId) {
    console.log('[dowloadDemos] Download demos for match ' + matchId + ' demo id is : ' + demoId);
    return new Promise(async function(resolve) {
        let path = `./matches/${matchId}`;
        var file_url = 'http://www.hltv.org/download/demo/' + demoId;
        const mkdir = util.promisify(fs.mkdir);
        await mkdir(path);
        var out = fs.createWriteStream(`${path}/${matchId}.rar`);
    
        var contentLength;
        var length = [];
        let lastCompletedParcentage = 0;
    
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
            let completedParcentage = Math.round((sum / contentLength) * 100);
            if (completedParcentage !== lastCompletedParcentage) {
                console.log(`[dowloadDemos] ${completedParcentage} % of download complete`);
                lastCompletedParcentage = completedParcentage;
            }
        });
        req.on('end', async function() {
            console.log('[dowloadDemos] Finished download for demo ' + matchId);
            await unrar(`${path}/${matchId}.rar`, `${path}/dem`,);
            console.log('[dowloadDemos] Finished unrar for demo ' + matchId);
            resolve(1);
        });
    })

}

async function parseDemos(matchId, mapNumber) {
    return new Promise (async(resolve) => {
        console.log('[parseDemos] Parsing demo for match ' + matchId + ' map ' + mapNumber);
        let path = `./matches/${matchId}`;
        const readdir = util.promisify(fs.readdir);
        var result = await (await readdir(`${path}/dem`)).filter(file => file.includes('.dem'));
        var map = '';
    
        if (result.length == 1) { // If there is only one map
            map = result[0]; 
        } else {
            let scope = `-m${mapNumber}-`;
            result.forEach(mapName => {
                if (mapName.includes(scope)) {
                    map = mapName;
                }
            })
        }
        console.log('[parseDemos] Map to parse is : ' + map)
        const matchInfos = await demoReader.readDemo(`${path}/dem/${map}`);
        await makeMatchJSONfile(matchId, mapNumber, matchInfos);
        resolve(1);
    })
}

async function makeMatchJSONfile(matchId, mapNumber, matchInfos) {
    return new Promise((resolve) => {
        let path = `./matches/${matchId}`;
        const output = JSON.stringify(matchInfos);
        writeFile(`${path}/${matchId}-map${mapNumber}.json`, output, 'utf8').then(() => {
            console.log('[parseDemos] Match JSON created for match ' + matchId + ' map n°' + mapNumber);
            resolve(1);
        });
    })
}

async function makeTwitchJSONfile(matchId, links) {
    return new Promise(async(resolve) => {
        let path = `./matches/${matchId}`;
        const output = JSON.stringify(links);
        writeFile(`${path}/twitch_infos.json`, output, 'utf8').then(() => {
            console.log('[parseDemos] Twitch JSON created');
            resolve(1);
        });
    })
}

function parseTwitchLink(twitchLink) {
    console.log(twitchLink)
    const scope = twitchLink.indexOf('&t=');
    const timeCode = twitchLink.slice(scope + 3);

    if(!timeCode.indexOf('h')) {
        console.log(timeCode)
        var hour = timeCode.split('h')[0];
        var minutes = timeCode.split('m')[0].split('h')[1];
    } else {
        hour = 0
        minutes = timeCode.split('m')[0];
    }
    var seconds = timeCode.split('m')[1].slice(0, -1);

    const pattern = 'video=v';
    const pos = twitchLink.indexOf(pattern) + pattern.length;
    var videoId = '';

    for (let i = pos; i < twitchLink.length; i++) {
        if (!isNaN(twitchLink[i])) {
            videoId += twitchLink[i];
        } else {
            break;
        }
    }
    // Start of the match in seconds. Minus 10 seconds because Twitch stream usually starts at 1:50
    const startVideoTime = ((+hour) * 60 * 60 + (+minutes) * 60 + (+seconds)) - 10;

    var twitchInfos = {
        videoId: videoId,
        startVideoTime: startVideoTime,
    };

    return twitchInfos;
}