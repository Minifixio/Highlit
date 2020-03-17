/* eslint-disable no-async-promise-executor */

/**
 * Imports
 */
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var demoManager = require("./demo_manager.js");
var dbManager = require("./database_manager.js");
var http = require('http').createServer(app);
var hltvManager = require("./hltv_manager.js");
var twitchManager = require("./twitch_manager.js");
var io = require('socket.io')(http);
app.use(cors());
twitchManager.getTwitchComments(568091412, 13209, 13267)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.get('/v1/last_matches', async function(req, res) {
    let response = await dbManager.getLastMatches();
    res.json(response);
});

app.post('/v1/map', async function(req, res) {
    let matchId = req.body.match_id;
    let mapNumber = req.body.map_number;
    let response = await demoManager.findMatchInfos(matchId, mapNumber);
    res.json(response);
});

app.post('/v1/maps', async function(req, res) {
    let matchId = req.body.match_id;
    let matchHasDemos = await dbManager.matchHasDemos(matchId);
    let response = await dbManager.getMapsInfos(matchId);
    if (!matchHasDemos) {
        console.log("[Get Maps] Maps for match " + matchId + " does not exist");
        let update = await demoManager.updateMatchInfos(matchId);
        if (update == 'match_not_available') {
            response = [];
        }
        if (update == 'demos_not_available') {
            response = [];
        } 
        if (update == true) {
            response = await dbManager.getMapsInfos(matchId);  
        }
    }
    res.json(response);
});

app.listen(3000, function () {
    console.log('[Express] App listening on port 3000');
});

http.listen(4000, function() {
    console.log('[Sockets] Sockets listening on port 4000');
});

io.on('connection', function(socket){
    socket.on('add-match', async function(matchId) {
        console.log("[Sockets] Add-match : " + matchId);
        let matchExists = await dbManager.matchExists(matchId);
        let matchDownloaded = await dbManager.isMatchDowloaded(matchId);

        if (!matchExists) { // Does the match already downloaded ?
            console.log("[AddMatch] Match doesn't exist");
            await demoManager.addMatchInfos(matchId);

        } else {

            console.log("[AddMatch] Match already exists");
            let matchHasDemos = await dbManager.matchHasDemos(matchId);

            if (!matchHasDemos) { // If match infos (such as demo_id, twitch JSON and maps...) does not exist
                await demoManager.updateMatchInfos(matchId);
            }

            let mapsCount = await dbManager.countMaps(matchId);

            if (mapsCount == 1) { // If there is only one map
                console.log("[AddMatch] There is only 1 map");

                let mapAvailable = await dbManager.isMapAvailable(matchId, 1);

                if (mapAvailable == "no") { // If map is not parsed
                    console.log("[AddMatch] ... but map is not available");
                    
                    if (matchDownloaded == 0) {
                        console.log("[AddMatch] ... and the match is not downloaded");
                        socket.emit('add-match', {type: 'starting_download'});
                        await demoManager.dowloadDemos(matchId);
                    }

                    if (matchDownloaded == 2) {
                        socket.emit('add-match', {type: 'map_being_downloaded', params: ""});
                    }

                    if (matchDownloaded == 1) {
                        socket.emit('add-match', {type: 'starting_parsing'});
                        await demoManager.parseDemo(matchId, 1); 
                    }
                } 
                
                if (mapAvailable == "parsing") {
                    socket.emit('add-match', {type: 'map_being_parsed', params: ""});
                }

                if (mapAvailable == "yes") {
                    let response = await demoManager.findMatchInfos(matchId, 1);
                    socket.emit('add-match', {type: 'game_infos', params: response});
                }

            } else {
                socket.emit(matchId, {type: 'select', params: mapsCount});
                socket.on('add-match', function(mapNumber) {
                    console.log(mapNumber);
                });
            }
        }
    });

    socket.on('select-map', async function(mapInfos) {
        let matchId = mapInfos.match_id;
        let mapNumber = mapInfos.map_number;
        let matchDownloaded = await dbManager.isMatchDowloaded(matchId);
        console.log(matchDownloaded);
        if (!matchDownloaded) { // Does the match already downloaded ?
            console.log("[SelectMap] Match is not dowloaded");
            socket.emit('select-map', {type: 'starting_download'});
            await demoManager.dowloadDemos(matchId);
        }

        let mapAvailable = await dbManager.isMapAvailable(matchId, mapNumber);
        console.log(mapAvailable);
        if (!mapAvailable) { // Does the map is already parsed ?
            socket.emit('select-map', {type: 'starting_parsing'});
            await demoManager.parseDemo(matchId, mapNumber);
        }
        let response = await demoManager.findMatchInfos(mapInfos.match_id, mapInfos.map_number);
        socket.emit('select-map', {type: 'game_infos', params: response});
    })
});

module.exports.socketEmit = function socketEmit(tag, content) {
    io.emit(tag, content);
}
