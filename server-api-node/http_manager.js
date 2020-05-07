/* eslint-disable no-async-promise-executor */
// Mainteance mode
const serverMaintenance = false;
const appMaintenance = true;

// Imports
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
var socketManager;
module.exports.http = http;

// Files
var demoManager = require("./demo_manager.js");
var dbManager = require("./database_manager.js");
var hltvManager = require("./hltv_manager.js");
var cronManager = require("./cron_manager.js");
var mailManager = require("./mail_manager.js");
var debugManager = require("./debug_manager.js");
const logger = new debugManager.Logger("http");

// Starting cron task
if(!serverMaintenance) { cronManager.cronJob.start(); logger.debug('Starting cron job') }

// Express
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.use(express.static('dist'));
app.use(express.static('maintenance_page'));

app.all("/match*", function(req, res){
    if(appMaintenance) {
        res.sendFile("maintenance.html", { root: __dirname + "/maintenance_page"});
    } else {
        res.sendFile("index.html", { root: __dirname + "/dist"});
    }
});

app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if(appMaintenance) {
        res.redirect("maintenance.html");
    }
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
        if (update == 3) {
            response = [];
        }
        if (update == 0) {
            response = await dbManager.getMapsInfos(matchId);  
        }
    } 

    let hasMapsWinnerId = await dbManager.hasMapsWinnerId(matchId);

    // For the old matches without winner team id for maps
    if (!hasMapsWinnerId) {
        await dbManager.updateMapsWinnerId(matchId)
        response = await dbManager.getMapsInfos(matchId);  
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
