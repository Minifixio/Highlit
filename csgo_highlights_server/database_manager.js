/* eslint-disable no-async-promise-executor */
var sq = require('sqlite3');
var matchesDB = new sq.Database(__dirname + '/database/matches.db');
//const util = require("util");
//const rundb = util.promisify(matches_db.run);

exports.addMatchInfos = async function addMatchInfos(matchInfos) {
    return new Promise(async (resolve) => {
        let matchDatas = [];
        let maps = matchInfos.maps;
    
        matchDatas.push(matchInfos.match_id, matchInfos.team1_name, matchInfos.team2_name, matchInfos.event);
        const matchQuery = "INSERT INTO matches(id, team1, team2, tournament) VALUES(?, ?, ?, ?) ";
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

exports.updateMapStatus = function updateMapStatus(mapInfos, status) {
    return new Promise(async (resolve) => {
        const mapQuery = "UPDATE maps_match SET available = ? WHERE id = ? AND map_number = ?";
        matchesDB.run(mapQuery, [status, mapInfos.match_id, mapInfos.map_number]);
        console.log("[DB manager] Updated map " + mapInfos.map_number + " for match " + mapInfos.match_id);
        resolve(1)
    })
}