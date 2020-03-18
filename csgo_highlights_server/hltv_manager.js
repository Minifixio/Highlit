/* eslint-disable no-async-promise-executor */

// Imports
const { HLTV } = require('hltv');

// Files
var dbManager = require("./database_manager.js");

exports.hltvMatchInfos = async function hltvMatchInfos(matchId) {
    console.log('[hltvMatchInfos] Looking for informations for match ' + matchId);
    return new Promise(async (resolve) => {
        var matchInfos = await HLTV.getMatch({id: matchId});
        let downloadLink = null;
        let demoId = null;
        let twitchStreams = null;
        let score = 0;
        let maps = [];

        if (matchInfos.statsId) { // Check if match has stats
            if(matchInfos.demos.filter(obj => obj.name.includes('GOTV')).length > 0) { // Check if demos are available
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
    
                const response = {
                    match_id: matchInfos.id,
                    twitchStreams: twitchStreams,
                    demoId: demoId,
                    team1_name: matchInfos.team1.name,
                    team2_name: matchInfos.team2.name,
                    tournament: matchInfos.event.name,
                    date: matchInfos.date,
                    format: matchInfos.format,
                    score: score,
                    maps: maps
                };
                resolve(response);

            } else {
                resolve('demos_not_available');
            }
        } else {
            resolve('match_not_available');
        }
    })
}

exports.getMapInfos = async function getMapInfos(mapId) {
    console.log('[getMapInfos] Looking for informations for map ' + mapId);
    return new Promise(async (resolve) => {
        var matchInfos = await HLTV.getMatch({id: mapId});
        console.log(matchInfos);
        resolve(1)
    })
}

exports.parseTwitchLink = function parseTwitchLink(twitchLink) {
    console.log(twitchLink)
    const scope = twitchLink.indexOf('&t=');
    const timeCode = twitchLink.slice(scope + 3);

    if(timeCode.includes('h')) {
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

exports.getLastMatches = async function getLastMatches() {
    let lastMatches = await HLTV.getResults({page: 1});
    console.log(lastMatches);
    dbManager.addLastMatches(lastMatches);
}