/* eslint-disable no-async-promise-executor */
var sq = require('sqlite3');
var matchesDB = new sq.Database(__dirname + '/database/matches.db');
//const util = require("util");
//const rundb = util.promisify(matches_db.run);

exports.addMatchInfos = async function addMatchInfos(matchInfos) {
    return new Promise(async (resolve) => {
        let matchDatas = [];
        let maps = matchInfos.maps;
    
        matchDatas.push(matchInfos.match_id, matchInfos.team1_name, matchInfos.team2_name, matchInfos.event, matchInfos.date, maps.length);
        const matchQuery = "INSERT INTO matches(id, team1, team2, tournament, maps, date) VALUES(?, ?, ?, ?, ?, ?) ";
        matchesDB.run(matchQuery, matchDatas);
    
        maps.forEach(async(map, index) => {
            let mapData = [];
            mapData.push(matchInfos.match_id, (index + 1), map.name, map.result, "no");
    
            const mapQuery = "INSERT INTO maps_match(id, map_number, map_name, score, available) VALUES(?, ?, ?, ?, ?)";
            matchesDB.run(mapQuery, mapData);
        });
        console.log("[DB manager] Added match " + matchInfos.match_id + " infos");
        resolve(1);
    })
}

exports.updateMapStatus = function updateMapStatus(matchId, mapNumber, status) {
    return new Promise(async (resolve) => {
        if (mapNumber == 0) {
            const mapDownloadingQuery = "UPDATE maps_match SET available = ? WHERE id = ?";
            matchesDB.run(mapDownloadingQuery, [status, matchId]);
            console.log("[DB manager] Updated maps status to " + status + " for match " + matchId);
        } else {
            const mapUpdateQuery = "UPDATE maps_match SET available = ? WHERE id = ? AND map_number = ?";
            matchesDB.run(mapUpdateQuery, [status, matchId, mapNumber]);
            console.log("[DB manager] Updated map " + mapNumber + " status to " + status + " for match " + matchId);
        }

        resolve(1)
    })
}

exports.findMatch = function findMatch(matchId) {
    return new Promise ((resolve) => {
        const matchQuery = "SELECT * FROM matches WHERE id = ?";
        matchesDB.get(matchQuery, [matchId], (err, row) => {
            if (err) {
                console.log(err);
            }
            if(!row) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    })
}

exports.isMapAvailable = function isMapAvailable(matchId, mapNumber) {
    return new Promise ((resolve) => {
        const matchQuery = "SELECT available FROM maps_match WHERE id = ? AND map_number = ?";
        matchesDB.get(matchQuery, [matchId, mapNumber], (err, row) => {
            if (err) {
                console.log(err);
            }
            if(row) {
                if(row.available == "yes") { 
                    resolve(true);
                } 
                if(row.available == "no") { // Make sure to add the case if the map is already downloading
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    })
}

exports.countMaps = async function countMaps(matchId) {
    return new Promise((resolve) => {
        const mapQuery = "SELECT maps FROM matches WHERE id = ?";
        matchesDB.get(mapQuery, [matchId], (err, row) => {
            resolve(row.maps);
        })
    })
}

exports.getMapsInfos = async function getMapsInfos(matchId) {
    return new Promise((resolve) => {
        const mapAllInfosQuery = "SELECT * FROM maps_match WHERE id = ?";
        matchesDB.get(mapAllInfosQuery, [matchId], (err, row) => {
            resolve(row);
        })
    })
}

exports.getMatchInfos = async function getMatchInfos(matchId) {
    return new Promise((resolve) => {
        const matchAllInfosQuery = "SELECT * FROM matches WHERE id = ?";
        matchesDB.get(matchAllInfosQuery, [matchId], (err, row) => {
            resolve(row);
        })
    })
}