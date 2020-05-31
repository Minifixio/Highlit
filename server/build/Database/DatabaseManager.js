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
exports.updateMapsWinnerId = exports.hasMapsWinnerId = exports.findMapScore = exports.lastUnavailableMatch = exports.findTeamName = exports.getAllMatches = exports.findMatchDate = exports.lastUndownloadedMatch = exports.getMatchDemoId = exports.matchHasDemos = exports.matchExists = exports.updateMatchInfos = exports.updateMatchStatus = exports.addLastMatches = exports.getLastMatchByDate = exports.getLastMatches = exports.clearDatabase = exports.clearMatchInfos = exports.getMatchInfos = exports.getMapsInfos = exports.countMaps = exports.isMapAvailable = exports.isMatchDowloaded = exports.updateMapStatus = exports.addMatchInfos = exports.logger = exports.matchesDB = void 0;
const sq = __importStar(require("sqlite3"));
const hltvMgr = __importStar(require("../HLTV/HLTVManager"));
const reqUtil = __importStar(require("./utils/DBRequests"));
const LoggerService_1 = require("../Debug/LoggerService");
exports.matchesDB = new sq.Database('./db/matches.db');
exports.logger = new LoggerService_1.Logger("db");
function addMatchInfos(matchInfos) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            exports.logger.debug("Adding new match to database");
            const matchDatas = {
                match_id: matchInfos.id,
                team1_id: matchInfos.team1.id,
                team2_id: matchInfos.team2.id,
                winner_team_id: (_a = matchInfos.winnerTeam) === null || _a === void 0 ? void 0 : _a.id,
                loser_team_id: (_b = matchInfos.loserTeam) === null || _b === void 0 ? void 0 : _b.id,
                tournament: matchInfos.event.name,
                match_format: matchInfos.format,
                result: matchInfos.result,
                date: matchInfos.date,
                demo_id: matchInfos.demoId,
                downloaded: matchInfos.available ? matchInfos.available : 3
            };
            const matchQuery = `INSERT INTO match(${Object.keys(matchDatas).join(',')}) VALUES(${Object.keys(matchDatas).map(val => val = '?').join(',')})`;
            yield reqUtil.run(matchQuery, Object.values(matchDatas));
            const maps = matchInfos.maps;
            for (const map of maps) {
                const mapData = {
                    match_id: matchInfos.id,
                    map_number: map.number,
                    map_name: map.name,
                    winner_team_id: map.winnerTeamId ? map.winnerTeamId : null,
                    result: map.result ? map.result : '-',
                    available: 0
                };
                const mapQuery = `INSERT INTO maps(${Object.keys(mapData).join(',')}) VALUES(${Object.keys(mapData).map(val => val = '?').join(',')})`;
                yield reqUtil.run(mapQuery, Object.values(mapData));
                exports.logger.debug("Added map " + map.number + " infos. Map is : " + map.name);
            }
            yield addTeam(matchInfos.team1);
            yield addTeam(matchInfos.team2);
            exports.logger.debug("Added match " + matchInfos.id + " infos");
        }
        catch (e) {
            throw e;
        }
    });
}
exports.addMatchInfos = addMatchInfos;
function updateMapStatus(matchId, mapNumber, status) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mapNumber === 0) {
            try {
                const mapsUpdateQuery = "UPDATE maps SET available = ? WHERE match_id = ?";
                yield reqUtil.run(mapsUpdateQuery, [status, matchId]);
                exports.logger.debug("Updated maps status to " + status + " for match " + matchId);
            }
            catch (e) {
                throw e;
            }
        }
        else {
            try {
                const mapUpdateQuery = "UPDATE maps SET available = ? WHERE match_id = ? AND map_number = ?";
                yield reqUtil.run(mapUpdateQuery, [status, matchId, mapNumber]);
                exports.logger.debug("Updated map " + mapNumber + " status to " + status + " for match " + matchId);
            }
            catch (e) {
                throw e;
            }
        }
    });
}
exports.updateMapStatus = updateMapStatus;
function isMatchDowloaded(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchQuery = "SELECT downloaded FROM match WHERE match_id = ?";
        try {
            const res = yield reqUtil.get(matchQuery, [matchId]);
            return res.downloaded;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.isMatchDowloaded = isMatchDowloaded;
function isMapAvailable(matchId, mapNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const matchQuery = "SELECT available FROM maps WHERE match_id = ? AND map_number = ?";
            const res = yield reqUtil.get(matchQuery, [matchId, mapNumber]);
            return res.available;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.isMapAvailable = isMapAvailable;
function countMaps(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mapQuery = "SELECT * FROM maps WHERE match_id = ?";
            const res = yield reqUtil.all(mapQuery, [matchId]);
            return res.length;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.countMaps = countMaps;
function getMapsInfos(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mapAllInfosQuery = "SELECT * FROM maps WHERE match_id = ?";
            const res = yield reqUtil.all(mapAllInfosQuery, [matchId]);
            return res;
        }
        catch (e) {
            return e;
        }
    });
}
exports.getMapsInfos = getMapsInfos;
function getMatchInfos(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const matchAllInfosQuery = "SELECT * FROM match WHERE match_id = ?";
            const res = yield reqUtil.all(matchAllInfosQuery, [matchId]);
            return res;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.getMatchInfos = getMatchInfos;
function clearMatchInfos(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteMatchQuery = "DELETE FROM match WHERE id = ?";
        const deleteMapsQuery = "DELETE FROM maps WHERE match_id = ?";
        yield reqUtil.run(deleteMatchQuery, [matchId]);
        yield reqUtil.run(deleteMapsQuery, [matchId]);
    });
}
exports.clearMatchInfos = clearMatchInfos;
function clearDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteMatchQuery = "DELETE FROM match";
        const deleteMapsQuery = "DELETE FROM maps";
        yield reqUtil.run(deleteMatchQuery, []);
        yield reqUtil.run(deleteMapsQuery, []);
    });
}
exports.clearDatabase = clearDatabase;
function getLastMatches() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lastMatchesQuery = "SELECT * FROM match ORDER BY date DESC LIMIT 15";
            const res = yield reqUtil.all(lastMatchesQuery, []);
            return res;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.getLastMatches = getLastMatches;
function getLastMatchByDate(startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lastMatchesQuery = "SELECT m.match_id, m.team1_id, m.team2_id, m.winner_team_id, m.tournament, m.match_format, m.result, m.stars, m.date, m.demo_id, m.downloaded, t1.team_name as team1_name, t2.team_name as team2_name FROM match m, team t1, team t2 WHERE date < ? AND date > ? AND t1.team_id = m.team1_id AND t2.team_id = m.team2_id ORDER BY date";
            const res = yield reqUtil.all(lastMatchesQuery, [startDate, endDate]);
            return res;
        }
        catch (e) {
            return [];
        }
    });
}
exports.getLastMatchByDate = getLastMatchByDate;
function addLastMatches(lastMatches) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const match of lastMatches) {
                const matchDatas = {
                    match_id: match.id,
                    team1_id: match.team1.id,
                    team2_id: match.team2.id,
                    tournament: match.event.name,
                    match_format: match.format,
                    result: match.result,
                    date: match.date,
                    stars: match.stars,
                    downloaded: 0
                };
                // 'OR IGNORE' means that if the match already exists, we don't add it
                const matchQuery = `INSERT OR IGNORE INTO match(${Object.keys(matchDatas).join(',')}) VALUES(${Object.keys(matchDatas).map(val => val = '?').join(',')})`;
                yield reqUtil.run(matchQuery, Object.values(matchDatas));
                yield addTeam(match.team1);
                yield addTeam(match.team2);
            }
            exports.logger.debug("Added last matches to DB");
        }
        catch (e) {
            throw e;
        }
    });
}
exports.addLastMatches = addLastMatches;
function updateMatchStatus(matchId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const statusQuery = "UPDATE match SET downloaded = ? WHERE match_id = ?";
            yield reqUtil.run(statusQuery, [status, matchId]);
            exports.logger.debug("Updated match status to " + status + " for match " + matchId);
        }
        catch (e) {
            throw e;
        }
    });
}
exports.updateMatchStatus = updateMatchStatus;
function updateMatchInfos(matchInfos) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Adding demo_id for future downloads
            const updateQuery = "UPDATE match SET demo_id = ?, winner_team_id = ?, downloaded = ? WHERE match_id = ?";
            yield reqUtil.run(updateQuery, [matchInfos.demoId, (_a = matchInfos.winnerTeam) === null || _a === void 0 ? void 0 : _a.id, matchInfos.available, matchInfos.id]);
            if (matchInfos.maps.length > 0) {
                for (const map of matchInfos.maps) {
                    const mapData = {
                        match_id: matchInfos.id,
                        map_number: map.number,
                        map_name: map.name,
                        result: map.result ? map.result : '-',
                        winner_team_id: map.winnerTeamId,
                        available: 0
                    };
                    const mapQuery = `INSERT INTO maps(${Object.keys(mapData).join(',')}) VALUES(${Object.keys(mapData).map(val => val = '?').join(',')})`;
                    yield reqUtil.run(mapQuery, Object.values(mapData));
                }
            }
        }
        catch (e) {
            throw e;
        }
    });
}
exports.updateMatchInfos = updateMatchInfos;
// To check if the match already EXISTS in the match table
function matchExists(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const statusQuery = "SELECT * FROM match WHERE match_id = ?";
            const res = yield reqUtil.all(statusQuery, [matchId]);
            if (res.length === 0) {
                exports.logger.debug("Match " + matchId + " does not exist");
                return false;
            }
            else {
                exports.logger.debug("Match " + matchId + " exists");
                return true;
            }
        }
        catch (e) {
            throw e;
        }
    });
}
exports.matchExists = matchExists;
// If the match has demos, it also means his TwitchInfosJSON has already been created as well
function matchHasDemos(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const statusQuery = "SELECT demo_id FROM match WHERE match_id = ?";
            const req = yield reqUtil.get(statusQuery, [matchId]);
            if (!req) {
                return false;
            }
            if (req.demo_id === null) {
                return false;
            }
            else {
                return true;
            }
        }
        catch (e) {
            throw e;
        }
    });
}
exports.matchHasDemos = matchHasDemos;
function getMatchDemoId(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const statusQuery = "SELECT demo_id FROM match WHERE match_id = ?";
            const req = yield reqUtil.get(statusQuery, [matchId]);
            return req.demo_id;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.getMatchDemoId = getMatchDemoId;
function lastUndownloadedMatch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const undownloadedQuery = "SELECT match_id FROM match WHERE downloaded = 0 ORDER BY date LIMIT 1";
            const req = yield reqUtil.get(undownloadedQuery, []);
            if (req) {
                return req.match_id;
            }
            else {
                return 0;
            }
        }
        catch (e) {
            throw e;
        }
    });
}
exports.lastUndownloadedMatch = lastUndownloadedMatch;
function findMatchDate(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dateQuery = "SELECT date FROM match WHERE match_id = ?";
            const req = yield reqUtil.get(dateQuery, [matchId]);
            return req.date;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.findMatchDate = findMatchDate;
function getAllMatches() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dateQuery = "SELECT * FROM match";
            const req = yield reqUtil.all(dateQuery, []);
            return req;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.getAllMatches = getAllMatches;
function findTeamName(teamId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getTeamByIdQuery = "SELECT team_name FROM team WHERE team_id = ?";
            const req = yield reqUtil.get(getTeamByIdQuery, [teamId]);
            return req.team_name;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.findTeamName = findTeamName;
function lastUnavailableMatch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const undownloadedQuery = "SELECT * FROM match WHERE downloaded = 3 ORDER BY date LIMIT 1";
            const req = yield reqUtil.all(undownloadedQuery, []);
            if (req) {
                return req[0];
            }
            else {
                return null;
            }
        }
        catch (e) {
            throw e;
        }
    });
}
exports.lastUnavailableMatch = lastUnavailableMatch;
function findMapScore(matchId, mapNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getMapScore = "SELECT result FROM maps WHERE match_id = ? AND map_number = ?";
            const req = yield reqUtil.get(getMapScore, [matchId, mapNumber]);
            return req.result;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.findMapScore = findMapScore;
function hasMapsWinnerId(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const winnerIdRequest = "SELECT winner_team_id FROM maps WHERE match_id = ?";
            const req = yield reqUtil.all(winnerIdRequest, [matchId]);
            if (req.filter(el => !el.winner_team_id).length > 0) {
                return false;
            }
            else {
                return true;
            }
        }
        catch (e) {
            throw e;
        }
    });
}
exports.hasMapsWinnerId = hasMapsWinnerId;
function updateMapsWinnerId(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mapsInfos = yield getMapsInfos(matchId);
            const mapTeamsRequest = "SELECT winner_team_id, team1_id, team2_id FROM match WHERE match_id = ?";
            const req = yield reqUtil.get(mapTeamsRequest, [matchId]);
            const winnerId = req.winner_team_id;
            let loserId;
            winnerId === req.team1_id ? loserId = req.team2_id : loserId = req.team1_id;
            const maps = hltvMgr.getMapWinner(mapsInfos, winnerId, loserId);
            for (const map of maps) {
                yield setMapWinnerId(matchId, map.number, map.winnerTeamId);
            }
        }
        catch (e) {
            throw e;
        }
    });
}
exports.updateMapsWinnerId = updateMapsWinnerId;
function setMapWinnerId(matchId, mapNumber, winnerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateWinnerRequest = "UPDATE maps SET winner_team_id = ? WHERE match_id = ? AND map_number = ?";
        yield reqUtil.run(updateWinnerRequest, [winnerId, matchId, mapNumber]);
    });
}
function addTeam(team) {
    return __awaiter(this, void 0, void 0, function* () {
        const teamQuery = "INSERT OR IGNORE INTO team(team_id, team_name) VALUES(?, ?)";
        yield reqUtil.run(teamQuery, [team.id, team.name]);
    });
}
//# sourceMappingURL=DatabaseManager.js.map