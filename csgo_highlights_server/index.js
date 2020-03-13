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
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.post('/v1/match_infos', async function (req, res, next) {
    try {
        let matchId = req.body.match_id;
        let mapNumber = req.body.map_number;
        let mapAvailable = await dbManager.isMapAvailable(matchId, mapNumber);

        if (mapAvailable) {
            var response = await demoManager.findDemoInfos(matchId, mapNumber);
            res.json(response);
        } else {
            await demoManager.parseDemo(matchId, mapNumber);
            response = await demoManager.findDemoInfos(matchId, mapNumber);
            res.json(response);
        }

    } catch (e) {
        next(e);
    }
});

app.post('/v1/add_match', async function (req, res, next) {
    let matchId = req.body.match_id;
    try {
        let matchExists = await dbManager.findMatch(matchId);
        if (matchExists) {
            let mapsCount = await dbManager.countMaps(matchId);
            if (mapsCount == 1) {
                let mapAvailable = await dbManager.isMapAvailable(matchId, 1);
                if (mapAvailable) {
                    console.log("[AddMatch] Match exists and there is only 1 map")
                    var response = await demoManager.findMatchInfos(matchId, 1);
                    res.json(response);
                } else {
                    await demoManager.parseDemo(matchId, 1);
                }
            }
        } 

        if(!matchExists) {
            console.log("[AddMatch] Match doesn't exist")
            await demoManager.addMatchInfos(matchId);
        }

        let matchInfos = await dbManager.getMatchInfos(matchId);
        let mapsInfos = await dbManager.getMapsInfos(matchId);

        response = {
            available: true,
            match_infos: matchInfos,
            maps_infos: mapsInfos
        }
        res.json(response);

    } catch (e) {
        next(e);
    }
});

app.listen(3000, function () {
    console.log('[Express] Example app listening on port 3000!');
});