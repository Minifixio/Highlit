/* eslint-disable no-async-promise-executor */
var sq = require('sqlite3');
var matchesDB = new sq.Database(__dirname + '/database/matches.db');
var debugManager = require("./debug_manager.js");
var hltvManager = require("./hltv_manager.js");
const logger = new debugManager.Logger("db");

exports.addMatchInfos = async function addMatchInfos(matchInfos) {
    return new Promise(async (resolve) => {
        let matchDatas = [];
        let maps = matchInfos.maps;
        logger.debug("Adding new match to database");

        matchDatas.push(
            matchInfos.id, 
            matchInfos.team1.id, 
            matchInfos.team2.id,
            matchInfos.winnerTeam.id,  
            matchInfos.event.name, 
            matchInfos.format,
            matchInfos.score,
            matchInfos.date,
            matchInfos.demoId,
            matchInfos.available
        );

        const matchQuery = "INSERT INTO match(match_id, team1_id, team2_id, winner_team_id, tournament, match_format, score, date, demo_id, downloaded) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";
        matchesDB.run(matchQuery, matchDatas);
    
        maps.forEach(async(map, index) => {
            let mapData = [];
            mapData.push(matchInfos.id, (index + 1), map.name, map.winnerTeamId, map.result, 0);
    
            const mapQuery = "INSERT INTO maps(match_id, map_number, map_name, winner_team_id, score, available) VALUES(?, ?, ?, ?, ?, ?)";
            await requestToDb(mapQuery, mapData);
            logger.debug("Added map " + (index + 1) + " infos. Map is : " + map.name);
        });

        addTeam(matchInfos.team1);
        addTeam(matchInfos.team2);

        logger.debug("Added match " + matchInfos.id + " infos");
        resolve();
    })
}

exports.updateMapStatus = function updateMapStatus(matchId, mapNumber, status) {
    return new Promise(async (resolve) => {
        if (mapNumber == 0) {
            const mapsUpdateQuery = "UPDATE maps SET available = ? WHERE match_id = ?";
            await requestToDb(mapsUpdateQuery, [status, matchId])
            logger.debug("Updated maps status to " + status + " for match " + matchId);
            resolve()
        } else {
            const mapUpdateQuery = "UPDATE maps SET available = ? WHERE match_id = ? AND map_number = ?";
            await requestToDb(mapUpdateQuery, [status, matchId, mapNumber]);
            logger.debug("Updated map " + mapNumber + " status to " + status + " for match " + matchId);
            resolve()
        }
    })
}

exports.isMatchDowloaded = function isMatchDowloaded(matchId) {
    return new Promise ((resolve, reject) => {
        const matchQuery = "SELECT downloaded FROM match WHERE match_id = ?";
        matchesDB.get(matchQuery, [matchId], (err, row) => {
            if (err) {
                logger.debug(err);
            }

            resolve(row.downloaded);
        });
    })
}

exports.isMapAvailable = function isMapAvailable(matchId, mapNumber) {
    return new Promise ((resolve) => {
        const matchQuery = "SELECT available FROM maps WHERE match_id = ? AND map_number = ?";
        matchesDB.get(matchQuery, [matchId, mapNumber], (err, row) => {
            if (err) {
                logger.debug(err);
            }
            if(row) {
                if(row.available == 1) { 
                    resolve(1);
                } 
                if(row.available == 0) { 
                    resolve(0);
                }
                if(row.available == 2) { // If the map is already being analysed
                    resolve(2);
                }
            } else {
                resolve('not_available');
            }
        });
    })
}

exports.countMaps = async function countMaps(matchId) {
    return new Promise((resolve) => {
        const mapQuery = "SELECT * FROM maps WHERE match_id = ?";
        matchesDB.all(mapQuery, [matchId], (err, row) => {
            const count = row.length;
            resolve(count);
        })
    })
}

exports.getMapsInfos = async function getMapsInfos(matchId) {
    return new Promise((resolve) => {
        const mapAllInfosQuery = "SELECT * FROM maps WHERE match_id = ?";
        matchesDB.all(mapAllInfosQuery, [matchId], (err, row) => {
            resolve(row);
        })
    })
}

exports.getMatchInfos = async function getMatchInfos(matchId) {
    return new Promise((resolve) => {
        const matchAllInfosQuery = "SELECT * FROM match WHERE match_id = ?";
        matchesDB.get(matchAllInfosQuery, [matchId], (err, row) => {
            logger.debug("Match " + matchId + " infos ", row);
            resolve(row);
        })
    })
}

exports.clearMatchInfos = async function clearMatchInfos(matchId) {
    const deleteMatchQuery = "DELETE FROM match WHERE id = ?";
    const deleteMapsQuery = "DELETE FROM maps WHERE match_id = ?";
    await requestToDb(deleteMatchQuery, [matchId]);
    await requestToDb(deleteMapsQuery, [matchId]);
}

exports.clearDatabase = async function clearDatabase() {
    const deleteMatchQuery = "DELETE FROM match";
    const deleteMapsQuery = "DELETE FROM maps";
    await requestToDb(deleteMatchQuery);
    await requestToDb(deleteMapsQuery);
}

async function requestToDb(query, params) {
    return new Promise((resolve, reject) => {
        matchesDB.run(query, params, function(err) {
            if(err) {
                logger.debug(err);
                reject(err);
            }
            resolve(1);
        })
    })
}

exports.getLastMatches = async function getLastMatches() {
    return new Promise((resolve, reject) => {
        const lastMatchesQuery = "SELECT * FROM match ORDER BY date DESC LIMIT 15";
        matchesDB.all(lastMatchesQuery, (err, row) => {
            if(err) {
                reject(err);
            } else {
                resolve(row);
            }
        })
    })
}

exports.getLastMatchByDate = async function getLastMatchByDate(startDate, endDate) {
    return new Promise((resolve, reject) => {
        const lastMatchesQuery = "SELECT m.match_id, m.team1_id, m.team2_id, m.winner_team_id, m.tournament, m.match_format, m.score, stars, m.date, m.demo_id, m.downloaded, t1.team_name as team1_name, t2.team_name as team2_name FROM match m, team t1, team t2 WHERE date < ? AND date > ? AND t1.team_id = m.team1_id AND t2.team_id = m.team2_id ORDER BY date";
        matchesDB.all(lastMatchesQuery, [startDate, endDate], (err, row) => {
            if(err) {
                reject(err);
            } else {
                resolve(row);
            }
        })
    })
}

exports.addLastMatches = async function addLastMatches(lastMatches) {
    return new Promise(async (resolve) => {
        // 'OR IGNORE' means that if the match already exists, we don't add it
        const matchQuery = "INSERT OR IGNORE INTO match(match_id, team1_id, team2_id, tournament, match_format, score, date, stars, downloaded) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        lastMatches.forEach(async(match) => {
            await requestToDb(matchQuery, [
                match.id,
                match.team1.id,
                match.team2.id,
                match.event.name,
                match.format,
                match.result,
                match.date,
                match.stars,
                0
            ]);

            await addTeam(match.team1);
            await addTeam(match.team2);
        });

        logger.debug("Added last matches to DB");
        resolve(1)
    })
}

exports.updateMatchStatus = function updateMatchStatus(matchId, status) {
    return new Promise(async (resolve) => {
        const statusQuery = "UPDATE match SET downloaded = ? WHERE match_id = ?";
        await requestToDb(statusQuery, [status, matchId]);
        logger.debug("Updated match status to " + status + " for match " + matchId);
        resolve()
    })
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