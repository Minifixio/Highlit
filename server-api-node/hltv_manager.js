/* eslint-disable no-async-promise-executor */

// Imports
const { HLTV } = require('hltv');

// Files
var dbManager = require("./database_manager.js");
var debugManager = require("./debug_manager.js");
const logger = new debugManager.logger("hltv");

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

        matchInfos.available = 0; // 0 means the match is not yet available

        if (!matchInfos.winnerTeam) { // If winnerTeam is undefined
            matchInfos.winnerTeam = {}
        }

        if(matchInfos.demos.filter(obj => obj.name.includes('GOTV')).length > 0 && matchInfos.demos.length >= 2) { // Check if demos are available and stream also (it means there are minimum 2 links)
            downloadLink = matchInfos.demos.filter(obj => obj.name.includes('GOTV'))[0].link;
            demoId = downloadLink.match(/(\d+)/)[0];
            twitchStreams = matchInfos.demos.filter(obj => obj.link.includes('twitch'));
            maps = matchInfos.maps.filter(map => map.statsId); // Check if map has been played or not
        } else {
            matchInfos.available = 3;
        }

        if (maps.length == 0) { 
            matchInfos.available = 3;
        } else {

            // For the BO2 cases
            if(matchInfos.format.includes("Best of 2") || matchInfos.format.includes("bo2")) {
                maps = getBO2winner(maps, matchInfos.team1, matchInfos.team2);
                if (maps[0].winnerTeamId == maps[1].winnerTeamId) {
                    maps[0].winnerTeamId == matchInfos.team1 ? score = "2 - 0": score = "0 - 2";
                    matchInfos.winnerTeam.id = maps[0].winnerTeamId;
                } else {
                    score = "1 - 1";
                    matchInfos.winnerTeam.id = 0;
                }

            } else {
                if (maps.length >= 2 && maps.length < 4) {
                    if (matchInfos.winnerTeam.name == matchInfos.team1.name) {
                        score = "2" + " - " + (maps.length - 2).toString();
                    } else {
                        score = (maps.length- 2).toString()  + " - " + "2";
                    }
                } else {
                    score = maps[0].result.substring(0, 4);
                }
    
                let loserTeam;
                matchInfos.winnerTeam.id == matchInfos.team1.id ? loserTeam = matchInfos.team2.id : loserTeam = matchInfos.team1.id;
                maps = this.getMapWinner(maps, matchInfos.winnerTeam.id, loserTeam);
            }
        }

        if (!matchInfos.statsId) { 
            matchInfos.available = 3;
        }
        
        matchInfos.twitchStreams = twitchStreams;
        matchInfos.demoId = demoId;
        matchInfos.score = score;
        matchInfos.maps = maps;

        resolve(matchInfos);
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

exports.getMatchInfos = async function getMatchInfos(id) {
    return new Promise(async(resolve) => {
        let matchInfos = await HLTV.getMatch({id: id});
        resolve(matchInfos)
    })
}

exports.getMapWinner = function getMapWinner(maps, winningTeam, losingTeam) {
    if (maps.length == 1) {
        maps[0].winnerTeamId = winningTeam;
    }

    if (maps.length == 2) {
        maps.forEach(map => {
            map.winnerTeamId = winningTeam;
        });
    }

    if (maps.length >= 3) {
        let team1maps = [];
        let team2maps = [];

        maps.forEach(map => {
            let result = map.result.substring(0, 5).split(":");

            result[0] > result[1] ? team1maps.push(map) : team2maps.push(map);
        });

        if (team1maps.length > team2maps.length) {
            team1maps.map(map => map.winnerTeamId = winningTeam);
            team2maps.map(map => map.winnerTeamId = losingTeam);
        } else {
            team2maps.map(map => map.winnerTeamId = winningTeam);
            team1maps.map(map => map.winnerTeamId = losingTeam);
        }

        maps = team1maps.concat(team2maps);
    }

    return maps;
}

function getBO2winner(maps, team1, team2) {
    let team1maps = [];
    let team2maps = [];
    maps.forEach(map => {
        let result = map.result.substring(0, 5).split(":").map(val => parseInt(val));

        result[0] > result[1] ? map.winnerTeamId = team1.id : map.winnerTeamId = team2.id 
    });

    return maps;
}