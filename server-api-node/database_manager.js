/* eslint-disable no-async-promise-executor */
var sq = require('sqlite3');
var matchesDB = new sq.Database(__dirname + '/database/matches.db');
var debugManager = require("./debug_manager.js");
const logger = new debugManager.logger("db");

exports.addMatchInfos = async function addMatchInfos(matchInfos) {
    return new Promise(async (resolve) => {
        let matchDatas = [];
        let maps = matchInfos.maps;
        logger.debug("Adding new match to database");

        matchDatas.push(
            matchInfos.id, 
            matchInfos.team1.name, 
            matchInfos.team2.name, 
            matchInfos.event.name, 
            matchInfos.format,
            matchInfos.score,
            matchInfos.date,
            matchInfos.demoId,
            0 // 0 equals to map not yet available
        );

        const matchQuery = "INSERT INTO match(match_id, team1, team2, tournament, match_format, score, date, demo_id, downloaded) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?) ";
        matchesDB.run(matchQuery, matchDatas);
    
        maps.forEach(async(map, index) => {
            let mapData = [];
            mapData.push(matchInfos.id, (index + 1), map.name, map.result, "no");
    
            const mapQuery = "INSERT INTO maps(match_id, map_number, map_name, score, available) VALUES(?, ?, ?, ?, ?)";
            await requestToDb(mapQuery, mapData);
            logger.debug("Added map " + (index + 1) + " infos. Map is : " + map.name);
        });
        logger.debug("Added match " + matchInfos.id + " infos");
        resolve(1);
    })
}

exports.updateMapStatus = function updateMapStatus(matchId, mapNumber, status) {
    return new Promise(async (resolve) => {
        if (mapNumber == 0) {
            const mapDownloadingQuery = "UPDATE maps SET available = ? WHERE match_id = ?";
            matchesDB.run(mapDownloadingQuery, [status, matchId]);
            logger.debug("Updated maps status to " + status + " for match " + matchId);
        } else {
            const mapUpdateQuery = "UPDATE maps SET available = ? WHERE match_id = ? AND map_number = ?";
            matchesDB.run(mapUpdateQuery, [status, matchId, mapNumber]);
            logger.debug("Updated map " + mapNumber + " status to " + status + " for match " + matchId);
        }
        resolve(1)
    })
}

exports.isMatchDowloaded = function isMatchDowloaded(matchId) {
    return new Promise ((resolve, reject) => {
        const matchQuery = "SELECT downloaded FROM match WHERE match_id = ?";
        matchesDB.get(matchQuery, [matchId], (err, row) => {
            if (err) {
                logger.debug(err);
            }
            if (row.downloaded == 0) {
                resolve(0);
            }
            if (row.downloaded == 1) {
                resolve(1);
            } 
            if (row.downloaded == 2) {
                resolve(2);
            } else {
                reject('Map not available');
            }
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
                if(row.available == "yes") { 
                    resolve('yes');
                } 
                if(row.available == "no") { 
                    resolve('no');
                }
                if(row.available == "parsing") { // If the map is already being analysed
                    resolve('parsing');
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
        const lastMatchesQuery = "SELECT * FROM match WHERE date < ? AND date > ? ORDER BY date";
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
    const matchQuery = "INSERT OR IGNORE INTO match(match_id, team1, team2, tournament, match_format, score, date, stars, downloaded) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?) ";
    lastMatches.forEach(async(match) => {
        await requestToDb(matchQuery, [
            match.id,
            match.team1.name,
            match.team2.name,
            match.event.name,
            match.format,
            match.result,
            match.date,
            match.stars,
            0
        ]);
    });

    logger.debug("Added last matches to DB");
    resolve(1)
    })
}

exports.updateMatchStatus = function updateMatchStatus(matchId, status) {
    return new Promise(async (resolve) => {
        const statusQuery = "UPDATE match SET downloaded = ? WHERE match_id = ?";
        matchesDB.run(statusQuery, [status, matchId]);
        logger.debug("Updated match status to " + status + " for match " + matchId);
        resolve(1)
    })
}

exports.updateMatchInfos = function updateMatchInfos(matchInfos) {
    return new Promise((resolve) => {
        let matchId = matchInfos.id;

        // Adding demo_id for future downloads
        const updateQuery = "UPDATE match SET demo_id = ? WHERE match_id = ?";
        matchesDB.run(updateQuery, [matchInfos.demoId, matchId]);
        logger.debug("Updated match " + matchId + " infos");
        matchInfos.maps.forEach(async(map, index) => { // Adding each map to the maps table
            let mapData = [];
            mapData.push(matchId, (index + 1), map.name, map.result, "no");
    
            const mapQuery = "INSERT INTO maps(match_id, map_number, map_name, score, available) VALUES(?, ?, ?, ?, ?)";
            await requestToDb(mapQuery, mapData);
            logger.debug("Added map " + (index + 1) + " infos. Map is : " + map.name);
        });
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
            if (row.demo_id == null) {
                logger.debug("Match " + matchId + " does not have a demo_id");
                resolve(false);
            } else {
                logger.debug("Match " + matchId + " has a demo_id");
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
        const undownloadedQuery = "SELECT match_id, team1, team2 FROM match WHERE downloaded = 0 ORDER BY date LIMIT 1";
        matchesDB.get(undownloadedQuery, (err, row) => {
            if (row) {
                logger.debug("Last undownloaded match is : " + row.team1 + " VS " + row.team2);
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