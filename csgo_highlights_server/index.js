const express = require('express')
const app = express()
const cors = require('cors')
const fs = require("fs")
const demofile = require("demofile")
const request = require('request');
const { HLTV } = require('hltv')
const util = require("util");
const {unrar} = require('unrar-promise');
app.use(cors())




function readDemo(demofileInput) {

    return new Promise((resolve) => {
        var timeOut = false;
        var winningTeam = {};
        var demoEnded = false;
        var timeReference = 0;
        var lastRoundTime = 0;
        var roundKills = [];
        var matchInfos = [];
        var lastRoundId = 0
    
        console.log('Reading demo: ' + demofileInput);
    
        fs.readFile(demofileInput, (err, buffer) => {
            const demoFile = new demofile.DemoFile();

            demoFile.entities.on("change", e => {
                if (
                  e.tableName == "DT_VoteController" &&
                  e.varName == "m_iOnlyTeamToVote" &&
                  e.newValue !== -1
                ) {
                    timeOut = true;
    
                    demoFile.teams.map(team => {
                        if (
                        team.props.DT_Team.m_iTeamNum ==
                        e.entity.props.DT_VoteController.m_iOnlyTeamToVote
                        ) {
                        console.log(
                            `Team called timeout: ${team.props.DT_Team.m_szClanTeamname}`
                        );
                        }
                    });
                }
            });
    
            demoFile.gameEvents.on("round_announce_match_start", e => {
                console.log(e)
                console.log('MATCH START')
                lastRoundTime = 0;
                roundKills = [];
                timeReference = demoFile.currentTime;
            });    
    
            demoFile.gameEvents.on("player_death", e => {
                var killInfos = {}; // Store kills infos
                const victim = demoFile.entities.getByUserId(e.userid);
                const victimName = victim ? victim.name : "unnamed";
        
                const attacker = demoFile.entities.getByUserId(e.attacker);
                const attackerName = attacker ? attacker.name : "unnamed";
                    
                killInfos = {
                    attackerName, 
                    victimName, 
                    "time": demoFile.currentTime - timeReference - 5
                }
                roundKills.push(killInfos);
            });

            demoFile.gameEvents.on("round_end", e => {
                const teams = demoFile.teams;
                // For later : add reason for ending
                if (e.winner == 2) { // id n°2 means terrorists
                    winningTeam = {
                        'side': 't',
                        'team_name': teams[2].props.DT_Team.m_szClanTeamname
                    };
                } 
                if (e.winner == 3) { // else it is CTs
                    winningTeam = {
                        'side': 'ct',
                        'team_name': teams[3].props.DT_Team.m_szClanTeamname
                    };
                }
    
                if (demoFile.gameRules.phase == 'postgame') {
                    console.log('Match ended')
                    resolve(matchInfos)
                }
            });
            
            demoFile.gameEvents.on("round_officially_ended", () => {
                // Later : add winning team
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];
                var roundId = cts.score + terrorists.score - 1;
                console.log('Round id : ' + roundId + ' / Last round id : ' + lastRoundId);
                if (lastRoundId !== roundId) {
                    console.log('Round Ended : ' + roundId + ' / Winning team: ' + winningTeam.team_name + '\n');
                    console.log('-----------------')
                    if (lastRoundId - roundId > 15) {
                        console.log('Match ended')
                        resolve(matchInfos)
                        demoFile.cancel();
                    }
        
                    let multipleKills = computeMultiKills(roundKills)
        
                    var pastRoundTime = demoFile.currentTime - timeReference;
                    if(timeOut == true) {
                        lastRoundTime += 30;
                        pastRoundTime += 30;
                    }
        
                    var pastRoundInfo = {
                        'start': lastRoundTime,
                        'end': pastRoundTime,
                        'round_number': roundId,
                        'winning_team': winningTeam,
                        'kills': roundKills,
                        'multipleKills': multipleKills
                    }
                    matchInfos.push(pastRoundInfo);
        
                    if (demoEnded == true) {
                        console.log('HEY')
                        resolve(matchInfos)
                        //demoFile.cancel();
                    }
                } 

                roundKills = [];
                winningTeam = {};
                timeOut = false;
                lastRoundTime = demoFile.currentTime - timeReference;
                lastRoundId = roundId
            });

            demoFile.parse(buffer);
        })
    })
    
}

function computeMultiKills(roundKills) {
    var multipleKills = [];
    var attackers = [];
    roundKills.forEach(kill => { // Making an array with names of each attackers of the round
        if (attackers.indexOf(kill.attackerName) === -1) {
            attackers.push(kill.attackerName)
        }
    })

    roundKills = roundKills.sort((a, b) => a.time - b.time); // Sorting by time order to have to start of multiple kill time

    attackers.forEach(attacker => { // For each attacker check occurence in roundKills and adding to multipleKills if his kills >= 3
        var killCount = 0;
        var multiKill = {
            'attackerName': attacker, 
            'kills': []
        };
        roundKills.forEach(kill => {
            if(kill.attackerName == attacker) {
                multiKill.kills.push(kill);
                killCount += 1;
            }
        })
        if (killCount >= 3) {
            multipleKills.push(multiKill);
        }
    });
    
    return multipleKills;
}

app.get('/v1/match_infos', function (req, res) {
    res.send(JSON.stringify('hello'))
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

async function findDemoInfos(matchId, mapNumber) {
    let path = `./matches/${matchId}`;
    if( !(fs.existsSync(path)) ) {
        console.log('[findDemoInfos] Folder doesnt exist')
        await dowloadDemos(matchId)
        parseDemos(matchId, mapNumber)
    } else {
        console.log('[findDemoInfos] Folder already exists')
        const readdir = util.promisify(fs.readdir);
        var result = await (await readdir(path)).filter(file => file.includes('map' + mapNumber));
        if (result.length == 0) {
            parseDemos(matchId, mapNumber)
        }
    }
}

async function dowloadDemos(matchId) {
    console.log('[dowloadDemos] Download demos for match ' + matchId)
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async function(resolve) {
        let path = `./matches/${matchId}`;
        var file_url = 'http://www.hltv.org/download/demo/' + matchId;
        const mkdir = util.promisify(fs.mkdir);
        await mkdir(path);
        var out = fs.createWriteStream(`${path}/${matchId}.rar`);
    
        var contentLength;
        var length = [];
        let lastCompletedParcentage = 0;
    
        var req = request({
            method: 'GET',
            uri: file_url
        });
        req.pipe(out);
        req.on( 'response', function ( data ) {
            contentLength = parseInt(data.headers['content-length']);
        });
        req.on('data', function (chunk) {
            length.push(chunk.length);
            let sum = length.reduce((a, b) => a + b, 0);
            let completedParcentage = Math.round((sum / contentLength) * 100);
            if (completedParcentage !== lastCompletedParcentage) {
                console.log(`${completedParcentage} % of download complete`);
                lastCompletedParcentage = completedParcentage;
            }
        });
        req.on('end', async function() {
            console.log('[dowloadDemos] Finished download for demo ' + matchId)
            await unrar(`${path}/${matchId}.rar`, `${path}/dem`,);
            console.log('[dowloadDemos] Finished unrar for demo ' + matchId)
            resolve(1)
        });
    })

}

async function parseDemos(matchId, mapNumber) {
    console.log('[parseDemos] Parsing demo for match ' + matchId + ' map ' + mapNumber)
    let path = `./matches/${matchId}`;
    const readdir = util.promisify(fs.readdir);
    var result = await (await readdir(`${path}/dem`)).filter(file => file.includes('.dem'));
    var map = '';

    if (mapNumber == 1) {
        map = result[0];
    }
    if (mapNumber > 1) {
        let scope = `-m${mapNumber}-`;
        result.forEach(mapName => {
            if (mapName.includes(scope)) {
                map = mapName;
            }
        })
    }
    console.log('[parseDemos] Map to parse is : ' + map)
    readDemo(`${path}/dem/${map}`).then(matchInfos => {
        var output = JSON.stringify(matchInfos);
        const writeFile = util.promisify(fs.writeFile);
        writeFile(`${path}/${matchId}-map${mapNumber}.json`, output, 'utf8').then(() => {
            console.log('DONE');
        });              
    });
}

//findDemoInfos(55839, 1)
parseDemos(55839, 1)
//readDemo("./matches/g2-vs-og-m2-dust2.dem");
