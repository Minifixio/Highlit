/* eslint-disable no-async-promise-executor */
// Mainteance mode
const maintenance = false;

// Imports
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;
var socketManager;
module.exports.http = http;

// Files
var demoManager = require("./demo_manager.js");
var demoReader = require("./demo_reader.js");
var dbManager = require("./database_manager.js");
var hltvManager = require("./hltv_manager.js");
var twitchManager = require("./twitch_manager.js");
var cronManager = require("./cron_manager.js");
var mailManager = require("./mail_manager.js");
var debugManager = require("./debug_manager.js");
var testManager = require("./test_manager.js");
const logger = new debugManager.logger("Http");

// Starting cron task
if(!maintenance) { cronManager.cronJob.start(); logger.debug('Starting cron job') }

// Express
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.use(express.static('dist'));

app.all("/match*", function(req, res){
    res.sendFile("index.html", { root: __dirname + "/dist"});
});

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.post('/v1/last_matches', async function(req, res) {
    let date = new Date(req.body.date);
    let endDate = new Date(date);
    let startDate = new Date(date);
    endDate = new Date(endDate.setDate(date.getDate() - 1)).setHours(24, 0, 0, 0);
    startDate = new Date(startDate.setDate(date.getDate())).setHours(24, 0, 0, 0);
    let response = await dbManager.getLastMatchByDate(startDate, endDate);
    res.json(response);
});

app.post('/v1/map', async function(req, res) {
    let matchId = req.body.match_id;
    let mapNumber = req.body.map_number;
    let response = await demoManager.findMatchInfos(matchId, mapNumber);
    res.json(response);
});

app.post('/v1/add-match', async function(req, res) {
    let matchId = req.body.match_id;
    socketManager.addMatch(matchId);
    res.json(true);
});

app.post('/v1/maps', async function(req, res) {
    let matchId = req.body.match_id;
    let matchHasDemos = await dbManager.matchHasDemos(matchId);
    let response = await dbManager.getMapsInfos(matchId);
    if (!matchHasDemos) {
        logger.debug("Maps for match " + matchId + " does not exist");
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

app.get('/v1/refresh', async function() {
    await hltvManager.getLastMatches();
});

app.post('/v1/mail', function(req, res) {
    if (req.body.type == 'error') {
        let matchId = req.body.match_id;
        let error = req.body.message;
        mailManager.mailError(matchId, error);
    }
    res.json(true);
});

http.listen(3000, function () {
    socketManager = require("./socket_manager.js");
    socketManager.startSockets(http);
    logger.debug('App listening on port 3000');
});


// Cron tasks
var job = new CronJob('*/30 * * * *', async function() {
    await hltvManager.getLastMatches();
    let matchId = await dbManager.lastUndownloadedMatch();

    if (matchId !== 0) {
        if ((await dbManager.matchHasDemos(matchId)) == false) {
            let update = await demoManager.updateMatchInfos(matchId);

            if (update == 'demos_not_available' || update == 'match_not_available') {
                let today = Date.now()
                let matchDate = await parseInt(dbManager.findMatchDate(matchId));

                if (today - matchDate > 172800000) { // 172800000 is 2 days in ms
                    await dbManager.updateMatchStatus(matchId, 3);
                }

                return false;
            }
        }
    
        if ((await dbManager.isMatchDowloaded(matchId)) == false) {
            await demoManager.dowloadDemos(matchId);
        }
    
        let mapsCount = await dbManager.countMaps(matchId);
    
        for (let mapId = 1; mapId < mapsCount + 1; mapId++) {
            await demoManager.parseDemo(matchId, mapId);
        }
    }
});