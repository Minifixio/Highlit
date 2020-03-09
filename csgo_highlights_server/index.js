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
        var request = req.body;
        var response = await demoManager.findDemoInfos(request.match_id, request.map_id);
        res.json(response);
    } catch (e) {
        next(e);
    }

})

app.listen(3000, function () {
    console.log('[Express] Example app listening on port 3000!');
})

const response = {
    id: 1,
    twitchStreams: 'hello',
    demoId: 34,
    team1_name: 'team1_O',
    team2_name: 'team2_O',
    event: 'event_O',
    maps: [
        {
            name: 'hello'
        },
        {
            name: 'hello2'
        }
    ]
}

