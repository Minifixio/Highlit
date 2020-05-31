"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMapWinner = exports.getMatchInfos = exports.getTeamInfos = exports.getLastMatches = exports.parseTwitchLink = exports.getMapInfos = exports.hltvMatchInfos = void 0;
// Imports
const hltv_1 = require("hltv");
const Errors_1 = require("../Errors/Errors");
const LoggerService_1 = require("../Debug/LoggerService");
const dbMngr = __importStar(require("../Database/DatabaseManager"));
// Files
const logger = new LoggerService_1.Logger("hltv");
function hltvMatchInfos(matchId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug('Looking for informations for match ' + matchId);
        const HLTVMatch = yield hltv_1.HLTV.getMatch({ id: matchId });
        let matchInfos;
        const matchFormat = HLTVMatch.format.toLocaleLowerCase();
        const GOTVlink = HLTVMatch.demos.filter(demo => demo.name.toLocaleLowerCase().includes('gotv'))[0].link;
        const twitchLinks = HLTVMatch.demos.filter(demo => demo.link.toLocaleLowerCase().includes('twitch'));
        let loserTeam = null;
        let winnerTeam = null;
        let team1Score = 0;
        let team2Score = 0;
        let format = 'unknown';
        let team1;
        let team2;
        let result;
        let playedMaps = HLTVMatch.maps.filter(map => map.statsId).map(map => { return { name: map.name, result: map.result, number: 0 }; });
        let demoId;
        if (!GOTVlink) {
            demoId = 0;
            throw Errors_1.Errors.HLTV.no_demoid;
        }
        else {
            demoId = Number(GOTVlink.split('/')[GOTVlink.split('/').length - 1]);
        }
        if (twitchLinks.length === 0 || (twitchLinks.length < playedMaps.length)) {
            throw Errors_1.Errors.HLTV.no_streams;
        }
        if (playedMaps.length === 0) {
            throw Errors_1.Errors.HLTV.no_maps;
        }
        if (!HLTVMatch.team2 || !HLTVMatch.team1 || !HLTVMatch.team2.id || !HLTVMatch.team1.id) {
            throw Errors_1.Errors.HLTV.no_teams;
        }
        else {
            team1 = { id: HLTVMatch.team1.id, name: HLTVMatch.team1.name };
            team2 = { id: HLTVMatch.team2.id, name: HLTVMatch.team2.name };
        }
        logger.debug('Match : ' + HLTVMatch.team1.name + ' VS ' + HLTVMatch.team2.name);
        if (HLTVMatch.winnerTeam && HLTVMatch.winnerTeam.id) {
            if (HLTVMatch.winnerTeam.id === ((_a = HLTVMatch.team1) === null || _a === void 0 ? void 0 : _a.id)) {
                loserTeam = { id: HLTVMatch.team2.id, name: HLTVMatch.team2.name };
                winnerTeam = { id: HLTVMatch.team1.id, name: HLTVMatch.team1.name };
            }
            else {
                loserTeam = { id: HLTVMatch.team1.id, name: HLTVMatch.team1.name };
                winnerTeam = { id: HLTVMatch.team2.id, name: HLTVMatch.team2.name };
            }
            playedMaps = getMapWinner(playedMaps, winnerTeam.id, loserTeam.id);
            team1Score = playedMaps.filter(map => { var _a; return map.winnerTeamId === ((_a = HLTVMatch.team1) === null || _a === void 0 ? void 0 : _a.id); }).length;
            team2Score = playedMaps.filter(map => { var _a; return map.winnerTeamId === ((_a = HLTVMatch.team2) === null || _a === void 0 ? void 0 : _a.id); }).length;
        }
        if (matchFormat.includes('bo5') || matchFormat.includes('best of 5') || matchFormat.includes('5')) {
            format = 'bo5';
        }
        if (matchFormat.includes('bo3') || matchFormat.includes('best of 3') || matchFormat.includes('3')) {
            format = 'bo3';
        }
        if (matchFormat.includes('bo2') || matchFormat.includes('best of 2') || matchFormat.includes('2')) {
            playedMaps = getBO2winner(playedMaps, HLTVMatch.team1, HLTVMatch.team2);
            team1Score = playedMaps.filter(map => { var _a; return map.winnerTeamId === ((_a = HLTVMatch.team1) === null || _a === void 0 ? void 0 : _a.id); }).length;
            team2Score = playedMaps.filter(map => { var _a; return map.winnerTeamId === ((_a = HLTVMatch.team2) === null || _a === void 0 ? void 0 : _a.id); }).length;
            format = 'bo2';
        }
        result = `${team1Score} - ${team2Score}`;
        if (matchFormat.includes('bo1') || matchFormat.includes('best of 1') || matchFormat.includes('1')) {
            format = 'bo1';
            if (playedMaps[0].result) {
                result = (_b = playedMaps[0].result) === null || _b === void 0 ? void 0 : _b.substring(0, 4);
            }
        }
        playedMaps.reduce((acc, cur) => {
            acc += 1;
            cur.number = acc;
            return acc;
        }, 0);
        matchInfos = {
            id: HLTVMatch.id,
            demoId,
            team1,
            team2,
            team1_score: team1Score,
            team2_score: team2Score,
            winnerTeam,
            loserTeam,
            format,
            result,
            date: HLTVMatch.date,
            event: HLTVMatch.event,
            maps: playedMaps,
            twitchLinks,
            available: 0
        };
        return matchInfos;
    });
}
exports.hltvMatchInfos = hltvMatchInfos;
function getMapInfos(mapId) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug('Looking for informations for map ' + mapId);
        const matchInfos = yield hltv_1.HLTV.getMatch({ id: mapId });
        logger.debug(matchInfos);
    });
}
exports.getMapInfos = getMapInfos;
function parseTwitchLink(twitchLink) {
    const scope = twitchLink.indexOf('&t=');
    const timeCode = twitchLink.slice(scope + 3);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (timeCode.includes('h') && timeCode.includes('m') && timeCode.includes('s')) {
        hours = Number(timeCode.split('h')[0]);
        minutes = Number(timeCode.split('m')[0].split('h')[1]);
        seconds = Number(timeCode.split('m')[1].slice(0, -1));
    }
    if (timeCode.includes('m') && timeCode.includes('s') && !timeCode.includes('h')) {
        minutes = Number(timeCode.split('m')[0]);
        seconds = Number(timeCode.split('m')[1].slice(0, -1));
    }
    if (timeCode.includes('h') && timeCode.includes('s') && !timeCode.includes('m')) {
        hours = Number(timeCode.split('h')[0]);
        seconds = Number(timeCode.split('h')[1].slice(0, -1));
    }
    if (timeCode.includes('h') && timeCode.includes('m') && !timeCode.includes('s')) {
        hours = Number(timeCode.split('h')[0]);
        minutes = Number(timeCode.split('h')[1].slice(0, -1));
    }
    if (timeCode.includes('h') && !timeCode.includes('m') && !timeCode.includes('s')) {
        hours = Number(timeCode.split('h')[0]);
    }
    if (timeCode.includes('m') && !timeCode.includes('h') && !timeCode.includes('s')) {
        minutes = Number(timeCode.split('m')[0]);
    }
    const pattern = 'video=v';
    const pos = twitchLink.indexOf(pattern) + pattern.length;
    let videoId = '';
    for (let i = pos; i < twitchLink.length; i++) {
        if (!isNaN(Number(twitchLink[i]))) {
            videoId += twitchLink[i];
        }
        else {
            break;
        }
    }
    // Start of the match in seconds. Minus 10 seconds because Twitch stream usually starts at 1:50
    const startVideoTime = ((+hours) * 60 * 60 + (+minutes) * 60 + (+seconds)) - 10;
    if (videoId.length > 0) {
        const twitchInfos = {
            videoId: Number(videoId),
            startVideoTime,
        };
        return twitchInfos;
    }
    else {
        throw Errors_1.Errors.HLTV.no_streams;
    }
}
exports.parseTwitchLink = parseTwitchLink;
function getLastMatches() {
    return __awaiter(this, void 0, void 0, function* () {
        const lastMatches = yield hltv_1.HLTV.getResults({ pages: 1, contentFilters: [hltv_1.ContentFilter.Demo, hltv_1.ContentFilter.Vod] });
        const res = [];
        lastMatches.forEach(match => {
            if (match.team1.id && match.team2.id) {
                res.push({
                    id: match.id,
                    team1: { id: match.team1.id, name: match.team1.name },
                    team2: { id: match.team2.id, name: match.team2.name },
                    format: match.format,
                    event: match.event,
                    map: match.map,
                    result: match.result,
                    stars: match.stars,
                    date: match.date,
                });
            }
        });
        yield dbMngr.addLastMatches(res);
    });
}
exports.getLastMatches = getLastMatches;
function getTeamInfos(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const teamInfos = yield hltv_1.HLTV.getTeam({ id });
        return teamInfos;
    });
}
exports.getTeamInfos = getTeamInfos;
function getMatchInfos(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchInfos = yield hltv_1.HLTV.getMatch({ id });
        return matchInfos;
    });
}
exports.getMatchInfos = getMatchInfos;
function getMapWinner(maps, winningTeam, losingTeam) {
    if (!losingTeam) {
        return [];
    }
    if (maps.length === 1) {
        maps[0].winnerTeamId = winningTeam;
    }
    if (maps.length === 2) {
        maps.forEach(map => {
            map.winnerTeamId = winningTeam;
        });
    }
    if (maps.length >= 3) {
        const team1maps = [];
        const team2maps = [];
        maps.forEach(map => {
            let result;
            map.result ? result = map.result.substring(0, 5).split(":") : result = [];
            result[0] > result[1] ? team1maps.push(map) : team2maps.push(map);
        });
        if (team1maps.length > team2maps.length) {
            team1maps.map(map => map.winnerTeamId = winningTeam);
            team2maps.map(map => map.winnerTeamId = losingTeam);
        }
        if (team1maps.length < team2maps.length) {
            team2maps.map(map => map.winnerTeamId = winningTeam);
            team1maps.map(map => map.winnerTeamId = losingTeam);
        }
        maps = team1maps.concat(team2maps);
    }
    return maps;
}
exports.getMapWinner = getMapWinner;
function getBO2winner(maps, team1, team2) {
    maps.forEach(map => {
        if (!map.result) {
            return [];
        }
        const result = map.result.substring(0, 5).split(":").map(val => Number(val));
        if (result[0] > result[1]) {
            map.winnerTeamId = team1.id;
        }
        else {
            map.winnerTeamId = team2.id;
        }
    });
    return maps;
}
//# sourceMappingURL=HLTVManager.js.map