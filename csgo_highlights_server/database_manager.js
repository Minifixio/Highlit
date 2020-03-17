/* eslint-disable no-async-promise-executor */
var sq = require('sqlite3');
var matchesDB = new sq.Database(__dirname + '/database/matches.db');
//const util = require("util");
//const rundb = util.promisify(matches_db.run);

exports.addMatchInfos = async function addMatchInfos(matchInfos) {
    return new Promise(async (resolve) => {
        let matchDatas = [];
        let maps = matchInfos.maps;
        console.log("[addMatchInfos] Adding new match to database :");
        console.log(matchInfos);

        matchDatas.push(
            matchInfos.match_id, 
            matchInfos.team1_name, 
            matchInfos.team2_name, 
            matchInfos.tournament, 
            matchInfos.format,
            matchInfos.score,
            matchInfos.date,
            matchInfos.demoId,
            2 // 2 equals to map downloading
        );

        const matchQuery = "INSERT INTO match(match_id, team1, team2, tournament, match_format, score, date, demo_id, downloaded) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?) ";
        matchesDB.run(matchQuery, matchDatas);
    
        maps.forEach(async(map, index) => {
            let mapData = [];
            mapData.push(matchInfos.match_id, (index + 1), map.name, map.result, "no");
    
            const mapQuery = "INSERT INTO maps(match_id, map_number, map_name, score, available) VALUES(?, ?, ?, ?, ?)";
            await requestToDb(mapQuery, mapData);
            console.log("[DB manager] Added map " + (index + 1) + " infos. Map is : " + map.name);
        });
        console.log("[DB manager] Added match " + matchInfos.match_id + " infos");
        resolve(1);
    })
}

exports.updateMapStatus = function updateMapStatus(matchId, mapNumber, status) {
    return new Promise(async (resolve) => {
        if (mapNumber == 0) {
            const mapDownloadingQuery = "UPDATE maps SET available = ? WHERE match_id = ?";
            matchesDB.run(mapDownloadingQuery, [status, matchId]);
            console.log("[DB manager] Updated maps status to " + status + " for match " + matchId);
        } else {
            const mapUpdateQuery = "UPDATE maps SET available = ? WHERE match_id = ? AND map_number = ?";
            matchesDB.run(mapUpdateQuery, [status, matchId, mapNumber]);
            console.log("[DB manager] Updated map " + mapNumber + " status to " + status + " for match " + matchId);
        }
        resolve(1)
    })
}

exports.isMatchDowloaded = function isMatchDowloaded(matchId) {
    return new Promise ((resolve, reject) => {
        const matchQuery = "SELECT downloaded FROM match WHERE match_id = ?";
        matchesDB.get(matchQuery, [matchId], (err, row) => {
            if (err) {
                console.log(err);
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
                console.log(err);
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
        const matchAllInfosQuery = "SELECT * FROM match WHERE id = ?";
        matchesDB.get(matchAllInfosQuery, [matchId], (err, row) => {
            console.log("[getMatchInfos] ", row);
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

async function requestToDb(query, params) {
    return new Promise((resolve, reject) => {
        matchesDB.run(query, params, function(err) {
            if(err) {
                console.log(err);
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

exports.addLastMatches = async function addLastMatches(lastMatches) {
    // 'OR IGNORE' means that if the match already exists, we don't add it
    const matchQuery = "INSERT OR IGNORE INTO match(match_id, team1, team2, tournament, match_format, score, date, downloaded) VALUES(?, ?, ?, ?, ?, ?, ?, ?) ";
    lastMatches.forEach(async(match) => {
        await requestToDb(matchQuery, [
            match.id,
            match.team1.name,
            match.team2.name,
            match.event.name,
            match.format,
            match.result,
            match.date,
            0
        ]);
    });
    console.log("[addLastMatches] Added last matches to DB");
}

exports.updateMatchInfos = function updateMatchInfos(matchId, status) {
    return new Promise(async (resolve) => {
        const statusQuery = "UPDATE match SET downloaded = ? WHERE match_id = ?";
        matchesDB.run(statusQuery, [status, matchId]);
        console.log("[DB manager] Updated match status to " + status + " for match " + matchId);
        resolve(1)
    })
}

exports.updateMatchInfos = function updateMatchInfos(matchInfos) {
    return new Promise((resolve) => {
        let matchId= matchInfos.match_id;
        // Adding demo_id for future downloads
        const updateQuery = "UPDATE match SET demo_id = ? WHERE match_id = ?";
        matchesDB.run(updateQuery, [matchInfos.demoId, matchId]);
        console.log("[updateMatchInfos] Updated match " + matchId + " infos");
        console.log(matchInfos.maps);
        matchInfos.maps.forEach(async(map, index) => { // Adding each map to the maps table
            let mapData = [];
            mapData.push(matchInfos.match_id, (index + 1), map.name, map.result, "no");
    
            const mapQuery = "INSERT INTO maps(match_id, map_number, map_name, score, available) VALUES(?, ?, ?, ?, ?)";
            await requestToDb(mapQuery, mapData);
            console.log("[DB manager] Added map " + (index + 1) + " infos. Map is : " + map.name);
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
                console.log("[DB manager] Match " + matchId + " does not exist");
                resolve(false);
            } else {
                console.log("[DB manager] Match " + matchId + " exists");
                resolve(true);
            }
        });
    })
}

// If the match has demos, it also means his TwitchInfosJSON has already been created as well
exports.matchHasDemos = function matchHasDemos(matchId) {
    return new Promise(async (resolve) => {
        const statusQuery = "SELECT demo_id FROM match WHERE match_id = ?";
        matchesDB.get(statusQuery, [matchId], (err, row) => {
            if (row.demo_id == null) {
                console.log("[DB manager] Match " + matchId + " does not have a demo_id");
                resolve(false);
            } else {
                console.log("[DB manager] Match " + matchId + " has a demo_id");
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