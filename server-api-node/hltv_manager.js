/* eslint-disable no-async-promise-executor */

// Imports
const { HLTV } = require('hltv');

// Files
var dbManager = require("./database_manager.js");
var debugManager = require("./debug_manager.js");
const logger = new debugManager.logger("HltvManager");

exports.hltvMatchInfos = async function hltvMatchInfos(matchId) {
    logger.debug('Looking for informations for match ' + matchId);
    return new Promise(async (resolve) => {
        var matchInfos = await HLTV.getMatch({id: matchId});
        let downloadLink = null;
        let demoId = null;
        let twitchStreams = null;
        let score = 0;
        let maps = [];

        logger.debug('Match : ' + matchInfos.team1.name + ' VS ' + matchInfos.team2.name);

        if (matchInfos.statsId) { // Check if match has stats
            if(matchInfos.demos.filter(obj => obj.name.includes('GOTV')).length > 0 && matchInfos.demos.length >= 2) { // Check if demos are available and stream also (it means there are minimum 2 links)
                downloadLink = matchInfos.demos.filter(obj => obj.name.includes('GOTV'))[0].link;
                demoId = downloadLink.match(/(\d+)/)[0];
                twitchStreams = matchInfos.demos.filter(obj => obj.link.includes('twitch'));
                maps = matchInfos.maps.filter(map => map.statsId); // Check if map has been played or not
        
                if (maps.length >= 2 && maps.length < 4) {
                    if (matchInfos.winnerTeam.name == matchInfos.team1.name) {
                        score = "2" + " - " + (maps.length - 2).toString();
                    } else {
                        score = (maps.length- 2).toString()  + " - " + "2";
                    }
                } else {
                    score = maps[0].result.substring(0, 4);
                }
                
                matchInfos.twitchStreams = twitchStreams;
                matchInfos.demoId = demoId;
                matchInfos.score = score;
                matchInfos.maps = maps;

                resolve(matchInfos);

            } else {
                resolve('demos_not_available');
            }
        } else {
            resolve('match_not_available');
        }
    })
}

exports.getMapInfos = async function getMapInfos(mapId) {
    logger.debug('Looking for informations for map ' + mapId);
    return new Promise(async (resolve) => {
        var matchInfos = await HLTV.getMatch({id: mapId});
        logger.debug(matchInfos);
        resolve(1)
    })
}

exports.parseTwitchLink = function parseTwitchLink(twitchLink) {
    const scope = twitchLink.indexOf('&t=');
    const timeCode = twitchLink.slice(scope + 3);

    if(timeCode.includes('h') && timeCode.includes('m') && timeCode.includes('s')) {
        var hours = timeCode.split('h')[0];
        var minutes = timeCode.split('m')[0].split('h')[1];
        var seconds = timeCode.split('m')[1].slice(0, -1);
    }
    if(timeCode.includes('m') && timeCode.includes('s') && !timeCode.includes('h')) {
        hours = 0;
        minutes = timeCode.split('m')[0];
        seconds = timeCode.split('m')[1].slice(0, -1);
    } 
    if (timeCode.includes('h') && timeCode.includes('s') && !timeCode.includes('m')) {
        minutes = 0;
        hours = timeCode.split('h')[0];
        seconds = timeCode.split('h')[1].slice(0, -1);
    }
    if (timeCode.includes('h') && timeCode.includes('m') && !timeCode.includes('s')) {
        seconds = 0;
        hours = timeCode.split('h')[0];
        minutes = timeCode.split('h')[1].slice(0, -1);
    }
    if (timeCode.includes('h') && !timeCode.includes('m') && !timeCode.includes('s')) {
        seconds = 0;
        minutes = 0;
        hours = timeCode.split('h')[0];
    }
    if (timeCode.includes('m') && !timeCode.includes('h') && !timeCode.includes('s')) {
        seconds = 0;
        hours = 0;
        minutes = timeCode.split('m')[0];
    }

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
    const startVideoTime = ((+hours) * 60 * 60 + (+minutes) * 60 + (+seconds)) - 10;

    var twitchInfos = {
        videoId: videoId,
        startVideoTime: startVideoTime,
    };

    return twitchInfos;
}

exports.getLastMatches = async function getLastMatches() {
    return new Promise(async(resolve) => {
        let lastMatches = await HLTV.getResults({page: 1, contentFilters: [1]});
        await dbManager.addLastMatches(lastMatches);
        resolve(1)
    })
}

exports.getTeamInfos = async function getTeamInfos(id) {
    return new Promise(async(resolve) => {
        let teamInfos = await HLTV.getTeam({id: id});
        resolve(teamInfos)
    })
}