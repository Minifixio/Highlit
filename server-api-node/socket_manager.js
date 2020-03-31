const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var io;
var mainSocket;

// Files
var demoManager = require("./demo_manager.js");
var dbManager = require("./database_manager.js");
var debugManager = require("./debug_manager.js");
const logger = new debugManager.logger("Sockets");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

module.exports.startSockets = function startSockets(http) {
    logger.debug("Start socket");
    io = require('socket.io')(http);
    io.on('connection', function(socket){
        
        mainSocket = socket;
    
        mainSocket.on('select-map', async function(mapInfos) {
            let matchId = mapInfos.match_id;
            let mapNumber = mapInfos.map_number;
            let matchDownloaded = await dbManager.isMatchDowloaded(matchId);
    
            switch (matchDownloaded) { // Does the match already downloaded ?
    
                case 0: {
                    logger.debug("[SelectMap] Match is not dowloaded");
                    mainSocket.emit('select-map', {type: 'match_not_downloaded'});
                    break;
                }
    
                case 1: {
                    let mapAvailable = await dbManager.isMapAvailable(matchId, mapNumber);
                    logger.debug(mapAvailable);
                    if (mapAvailable == "no") { // Does the map is already parsed ?
                        mainSocket.emit('select-map', {type: 'starting_parsing'});
                        await demoManager.parseDemo(matchId, mapNumber);
                    }
                    let response = await demoManager.findMatchInfos(mapInfos.match_id, mapInfos.map_number);
                    mainSocket.emit('select-map', {type: 'game_infos', params: response});
                    break;
                }
    
                case 2: {
                    mainSocket.emit('select-map', {type: 'map_being_downloaded', params: ""});
                    break;
                }
            }
        })
    });
}

module.exports.addMatch = async function addMatch(matchId) {
    logger.debug("Add-match : " + matchId);
    let matchExists = await dbManager.matchExists(matchId);

    if (!matchExists) { // Does the match already downloaded ?
        logger.debug("[AddMatch] Match doesn't exist");
        await demoManager.addMatchInfos(matchId);
    } 

    logger.debug("[AddMatch] Match already exists");
    let matchHasDemos = await dbManager.matchHasDemos(matchId);

    if (!matchHasDemos) { // If match infos (such as demo_id, twitch JSON and maps...) does not exist
        await demoManager.updateMatchInfos(matchId);
    }

    let mapsCount = await dbManager.countMaps(matchId);

    // Setting this if to 10 for now because the functionality of choosing a map is not yet available 
    if (mapsCount == 10) { // If there is only one map
        logger.debug("[AddMatch] There is only 1 map");

        let mapAvailable = await dbManager.isMapAvailable(matchId, 1);

        switch (mapAvailable) {

            case 'no': {
                logger.debug("[AddMatch] ... but map is not available");
                let matchDownloaded = await dbManager.isMatchDowloaded(matchId);
                switch (matchDownloaded) {
                    case 0: {
                        logger.debug("[AddMatch] ... and the match is not downloaded");
                        mainSocket.emit('select-map', {type: 'starting_download'});
                        await demoManager.dowloadDemos(matchId);
                        break;
                    }

                    case 1: {
                        mainSocket.emit('select-map', {type: 'starting_parsing'});
                        await demoManager.parseDemo(matchId, 1); 
                        break;
                    }

                    case 2: {
                        mainSocket.emit('select-map', {type: 'map_being_downloaded', params: ""});
                    }
                }
                break;
            }

            case 'yes': {
                let response = await demoManager.findMatchInfos(matchId, 1);
                mainSocket.emit('select-map', {type: 'game_infos', params: response});
                break;
            }

            case 'parsing' : {
                mainSocket.emit('select-map', {type: 'map_being_parsed', params: ""});
                break;
            }
        }

    } else { // If there is more than one map
        let mapsInfos = await dbManager.getMapsInfos(matchId);
        mainSocket.emit('select-map', {type: 'select-map', params: mapsInfos}); // User selects the map number
    }
}
module.exports.socketEmit = function socketEmit(tag, content) {
    io.emit(tag, content);
}