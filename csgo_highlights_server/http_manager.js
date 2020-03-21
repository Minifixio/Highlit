/* eslint-disable no-async-promise-executor */

// Imports
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;

// Files
var demoManager = require("./demo_manager.js");
var demoReader = require("./demo_reader.js");
var dbManager = require("./database_manager.js");
var hltvManager = require("./hltv_manager.js");
var twitchManager = require("./twitch_manager.js");
var socketManager = require("./socket_manager.js");
var debugManager = require("./debug_manager.js");
const logger = new debugManager.logger("Http");

// Express
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );
hltvManager.getLastMatches();

// Cron tasks
var job = new CronJob('0 1 * * *', function() {
    hltvManager.getLastMatches();
    const d = new Date();
	logger.debug('Cron task : ', d);
});

job.start();

app.use(express.static('dist'));

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
    startDate = new Date(startDate.setDate(date.getDate() + 1)).setHours(24, 0, 0, 0);
    let response = await dbManager.getLastMatchByDate(startDate, endDate);
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
    hltvManager.getLastMatches();
});

app.listen(3000, function () {
    logger.debug('App listening on port 3000');
});

socketManager.startSockets();