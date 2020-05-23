import * as sq from 'sqlite3'
import * as hltvMgr from '../HLTV/HLTVManager'
import * as reqUtil from './utils/DBRequests'
import { HLTVMatchInfos } from '../HLTV/models/HLTVMatchInfos';
import { DBMatchInfos } from './models/DBMatchInfos';
import { HLTVMapResult } from '../HLTV/models/HLTVMapResult';
import { DBMapInfos } from './models/DBMapInfos';

var debugManager = require("./debug_manager.js");

export const matchesDB = new sq.Database(__dirname + '/database/matches.db');
export const logger = new debugManager.Logger("db");


export async function addMatchInfos(matchInfos: HLTVMatchInfos): Promise<void> {

    try {
        logger.debug("Adding new match to database");

        const matchDatas: DBMatchInfos = {
            match_id: matchInfos.id,
            team1_id: matchInfos.team1.id,
            team2_id: matchInfos.team2.id,
            winner_team_id: matchInfos.winnerTeam?.id,
            loser_team_id: matchInfos.loserTeam?.id,
            tournament: matchInfos.event.name,
            match_format: matchInfos.format,
            result: matchInfos.result,
            date: matchInfos.date,
            demo_id: matchInfos.demoId,
            downloaded: matchInfos.available ?  matchInfos.available : 3
        }

        const matchQuery = `INSERT INTO match(${Object.keys(matchDatas).join(',')}) VALUES(${Object.keys(matchDatas).map(val => val = '?').join(',')})`
        await reqUtil.insert(matchQuery, Object.values(matchDatas));


        const maps: HLTVMapResult[] = matchInfos.maps

        for (const map of maps) {

            const mapData: DBMapInfos = {
                match_id: matchInfos.id,
                map_number: map.number,
                map_name: map.name,
                winner_team_id: map.winnerTeamId? map.winnerTeamId : null,
                score: map.result ? map.result : '-',
                available: 0
            }

            const mapQuery = `INSERT INTO maps(${Object.keys(mapData).join(',')}) VALUES(${Object.keys(mapData).map(val => val = '?').join(',')})`
            await reqUtil.insert(mapQuery, Object.values(mapData));

            logger.debug("Added map " + map.number + " infos. Map is : " + map.name);
        }

        await addTeam(matchInfos.team1);
        await addTeam(matchInfos.team2);

        logger.debug("Added match " + matchInfos.id + " infos");

    } catch(e) {
        throw e
    }

}

export async function updateMapStatus(matchId: number, mapNumber: number, status: number): Promise<void> {
    if (mapNumber === 0) {
        try {
            const mapsUpdateQuery = "UPDATE maps SET available = ? WHERE match_id = ?";
            await reqUtil.insert(mapsUpdateQuery, [status, matchId])
            logger.debug("Updated maps status to " + status + " for match " + matchId);
        } catch(e) {
            throw e
        }

    } else {
        try {
            const mapUpdateQuery = "UPDATE maps SET available = ? WHERE match_id = ? AND map_number = ?";
            await reqUtil.insert(mapUpdateQuery, [status, matchId, mapNumber]);
            logger.debug("Updated map " + mapNumber + " status to " + status + " for match " + matchId);
        } catch(e) {
            throw e
        }
    }
}

export async function isMatchDowloaded(matchId: number) {
    const matchQuery = "SELECT downloaded FROM match WHERE match_id = ?";
    try {
        const res = await reqUtil.get(matchQuery, [matchId])
        return res.downloaded
    } catch(e) {
        throw e
    }
}

export async function isMapAvailable(matchId: number, mapNumber: number) {
    try {
        const matchQuery = "SELECT available FROM maps WHERE match_id = ? AND map_number = ?";
        const res = await reqUtil.get(matchQuery, [matchId, mapNumber])
        return res.available
    } catch(e) {
        throw e
    }
}

export async function countMaps(matchId: number) {
    try {
        const mapQuery = "SELECT * FROM maps WHERE match_id = ?";
        const res = await reqUtil.all(mapQuery, [matchId])
        return res.length
    } catch(e) {
        throw e
    }
}

export async function getMapsInfos(matchId: number) {
    try {
        const mapAllInfosQuery = "SELECT * FROM maps WHERE match_id = ?";
        const res = await reqUtil.all(mapAllInfosQuery, [matchId])
        return res
    } catch(e) {
        return e
    }
}

export async function getMatchInfos(matchId: number) {
    try {
        const matchAllInfosQuery = "SELECT * FROM match WHERE match_id = ?";
        const res = await reqUtil.all(matchAllInfosQuery, [matchId])
        return res
    } catch(e) {
        throw e
    }
}

export async function clearMatchInfos(matchId: number) {
    const deleteMatchQuery = "DELETE FROM match WHERE id = ?";
    const deleteMapsQuery = "DELETE FROM maps WHERE match_id = ?";
    await reqUtil.insert(deleteMatchQuery, [matchId]);
    await reqUtil.insert(deleteMapsQuery, [matchId]);
}

export async function clearDatabase() {
    const deleteMatchQuery = "DELETE FROM match";
    const deleteMapsQuery = "DELETE FROM maps";
    await reqUtil.insert(deleteMatchQuery, []);
    await reqUtil.insert(deleteMapsQuery, []);
}

export async function getLastMatches() {
    try {
        const lastMatchesQuery = "SELECT * FROM match ORDER BY date DESC LIMIT 15";
        const res = await reqUtil.all(lastMatchesQuery, [])
        return res
    } catch(e) {
        throw e
    }
}

export async function getLastMatchByDate(startDate: number, endDate: number) {
    try {
        const lastMatchesQuery = "SELECT m.match_id, m.team1_id, m.team2_id, m.winner_team_id, m.tournament, m.match_format, m.score, stars, m.date, m.demo_id, m.downloaded, t1.team_name as team1_name, t2.team_name as team2_name FROM match m, team t1, team t2 WHERE date < ? AND date > ? AND t1.team_id = m.team1_id AND t2.team_id = m.team2_id ORDER BY date";
        const res = await reqUtil.all(lastMatchesQuery, [startDate, endDate])
        return res
    } catch(e) {
        throw e
    }
}

export async function addLastMatches(lastMatches: HLTVMatchInfos[]) {
    try {

        for (const match of lastMatches) {

            const matchDatas: DBMatchInfos = {
                match_id: match.id,
                team1_id: match.team1.id,
                team2_id: match.team2.id,
                tournament: match.event.name,
                match_format: match.format,
                result: match.result,
                date: match.date,
                stars: match.stars,
                downloaded: 0
            }

            // 'OR IGNORE' means that if the match already exists, we don't add it
            const matchQuery = `INSERT OR IGNORE INTO match(${Object.keys(matchDatas).join(',')}) VALUES(${Object.keys(matchDatas).map(val => val = '?').join(',')})`;
            await reqUtil.insert(matchQuery, Object.values(matchDatas));
            await addTeam(match.team1);
            await addTeam(match.team2);
        }

        logger.debug("Added last matches to DB");

    } catch(e) {
        throw e
    }
}

export async function updateMatchStatus(matchId: number, status: number) {
    try {
        const statusQuery = "UPDATE match SET downloaded = ? WHERE match_id = ?";
        await reqUtil.insert(statusQuery, [status, matchId])
        logger.debug("Updated match status to " + status + " for match " + matchId);
    } catch(e) {
        throw e
    }
}

exports.updateMatchInfos = function updateMatchInfos(matchInfos) {
    return new Promise((resolve) => {
        let matchId = matchInfos.id;

        // Adding demo_id for future downloads
        const updateQuery = "UPDATE match SET demo_id = ?, winner_team_id = ?, downloaded = ? WHERE match_id = ?";
        matchesDB.run(updateQuery, [matchInfos.demoId, matchInfos.winnerTeam.id, matchInfos.available, matchId]);
        //logger.debug("Updated match " + matchId + " infos");

        matchInfos.maps.length > 0 ? matchInfos.maps.forEach(async(map, index) => { // Adding each map to the maps table
            let mapData = [];
            mapData.push(matchId, (index + 1), map.name, map.result, 0);
    
            const mapQuery = "INSERT INTO maps(match_id, map_number, map_name, score, available) VALUES(?, ?, ?, ?, ?)";
            await requestToDb(mapQuery, mapData);
            //logger.debug("Added map " + (index + 1) + " infos. Map is : " + map.name);
        }) : null;
        resolve(1);
    })
}

// To check if the match already EXISTS in the match table
exports.matchExists = function matchExists(matchId) {
    return new Promise(async (resolve) => {
        const statusQuery = "SELECT * FROM match WHERE match_id = ?";
        matchesDB.all(statusQuery, [matchId], (err, row) => {
            if (row.length == 0) {
                logger.debug("Match " + matchId + " does not exist");
                resolve(false);
            } else {
                logger.debug("Match " + matchId + " exists");
                resolve(true);
            }
        });
    })
}

// If the match has demos, it also means his TwitchInfosJSON has already been created as well
exports.matchHasDemos = async function matchHasDemos(matchId) {
    return new Promise(async (resolve) => {
        const statusQuery = "SELECT demo_id FROM match WHERE match_id = ?";
        matchesDB.get(statusQuery, [matchId], (err, row) => {
            if (!row) {
                resolve(false);
                return;
            }

            if (row.demo_id == null) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    })
}

exports.getMatchDemoId = function getMatchDemoId(matchId) {
    return new Promise(async (resolve, reject) => {
        const statusQuery = "SELECT demo_id FROM match WHERE match_id = ?";
        matchesDB.get(statusQuery, [matchId], (err, row) => {
            if(err) {
                reject(err);
            }
            resolve(row.demo_id)
        });
    })
}

exports.lastUndownloadedMatch = async function lastUndownloadedMatch() {
    return new Promise(async (resolve) => {
        const undownloadedQuery = "SELECT match_id, team1_id, team2_id FROM match WHERE downloaded = 0 ORDER BY date LIMIT 1";
        matchesDB.get(undownloadedQuery, (err, row) => {
            if (row) {
                //logger.debug("Last undownloaded match is : " + row.team1_id + " VS " + row.team2_id);
                resolve(row.match_id);
            } else {
                resolve(0);
            }
        })
    })
}

exports.findMatchDate = async function findMatchDate(matchId) {
    return new Promise((resolve) => {
        const dateQuery = "SELECT date FROM match WHERE match_id = ?";
        matchesDB.get(dateQuery, [matchId], (err, row) => {
            resolve(row.date);
        })
    })
}

exports.getAllMatches = async function getAllMatches() {
    return new Promise((resolve) => {
        const dateQuery = "SELECT * FROM match";
        matchesDB.all(dateQuery, (err, row) => {
            resolve(row);
        })
    })
}

exports.findTeamName = async function findTeamName(teamId) {
    return new Promise((resolve) => {
        const getTeamByIdQuery = "SELECT team_name FROM team WHERE team_id = ?"
        matchesDB.get(getTeamByIdQuery, [teamId], (err, row) => {
            resolve(row.team_name);
        })
    })
}

async function addTeam(team) {
    return new Promise(async(resolve) => {
        const teamQuery = "INSERT OR IGNORE INTO team(team_id, team_name) VALUES(?, ?)";
        await requestToDb(teamQuery, [team.id, team.name]);
        resolve();
    })
}

exports.lastUnavailableMatch = async function lastUnavailableMatch() {
    return new Promise(async (resolve) => {
        const undownloadedQuery = "SELECT * FROM match WHERE downloaded = 3 ORDER BY date LIMIT 1";
        matchesDB.all(undownloadedQuery, (err, row) => {
            if (row) {
                resolve(row);
            } else {
                resolve(false);
            }
        })
    })
}

exports.findMapScore = async function findMapScore(matchId, mapNumber) {
    return new Promise((resolve) => {
        const getMapScore = "SELECT score FROM maps WHERE match_id = ? AND map_number = ?"
        matchesDB.get(getMapScore, [matchId, mapNumber], (err, row) => {
            resolve(row.score);
        })
    })
}


exports.hasMapsWinnerId = async function hasMapsWinnerId(matchId) {
    return new Promise((resolve) => {
        const winnerIdRequest = "SELECT winner_team_id FROM maps WHERE match_id = ?"
        matchesDB.all(winnerIdRequest, [matchId], (err, row) => {
            
            row.forEach(el => { if(!el.winner_team_id) { resolve(false); return; } });
            resolve(true)
        })
    })
}

exports.updateMapsWinnerId = async function updateMapsWinnerId(matchId) {
    return new Promise(async(resolve) => {
        const mapsInfos = await this.getMapsInfos(matchId);

        const mapTeamsRequest = "SELECT winner_team_id, team1_id, team2_id FROM match WHERE match_id = ?";

        matchesDB.get(mapTeamsRequest, [matchId], (err, row) => {
            const winnerId = row.winner_team_id;
            let loserId = "";
            winnerId == row.team1_id ? loserId = row.team2_id : loserId = row.team1_id;

            mapsInfos.map(map => map.result = map.score);
            let maps = hltvManager.getMapWinner(mapsInfos, winnerId, loserId);

            maps.forEach(async(map) => await setMapWinnerId(matchId, map.map_number, map.winnerTeamId));
            resolve()
        });
    })
}

async function setMapWinnerId(matchId, mapNumber, winnerId) {
    return new Promise(async (resolve) => {
        const updateWinnerRequest = "UPDATE maps SET winner_team_id = ? WHERE match_id = ? AND map_number = ?";

        await requestToDb(updateWinnerRequest, [winnerId, matchId, mapNumber]);
        resolve();
    })
}