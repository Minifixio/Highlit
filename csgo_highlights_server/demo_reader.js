/**
 * Imports
 */

const demofile = require("demofile")
const fs = require("fs")

exports.readDemo = function readDemo(demofileInput) {

    return new Promise((resolve) => {
        var timeOut = false;
        var winningTeam = {};
        var roundId = 0;
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
    
            demoFile.gameEvents.on("round_announce_match_start", () => {
                /*
                * In some special demos (as ESEA), post-game phase or event game-end isn't working...
                * ...but "round_announce_match_start" seems to trigger when sides are switching and when match ends.
                */
                if (roundId == 15) { 
                    console.log('Changing sides');
                }
                if (roundId > 15) {
                    console.log('Match end');
                    resolve(matchInfos);
                    demoFile.cancel();
                } 
                if (roundId < 15) {
                    console.log('=> => => => Match starting');
                    lastRoundTime = 0;
                    roundKills = [];
                    matchInfos = [];
                    timeReference = demoFile.currentTime;
                }
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
                    "time": demoFile.currentTime - timeReference
                }
                roundKills.push(killInfos);
            });

            demoFile.gameEvents.on("cs_match_end_restart", () => {
                console.log('cs_match_end_restart event');
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
    
                if (demoFile.gameRules.phase == 'postgame') { // If we enter postgame, then the match will end
                    makeRoundStats();
                    console.log('Postgame phase');
                    resolve(matchInfos);
                    demoFile.cancel();
                }
            });
            
            demoFile.gameEvents.on("round_officially_ended", () => {
                // Later : add winning team
                makeRoundStats();

            });

            function makeRoundStats() {
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];
                roundId = cts.score + terrorists.score;

                // Sometimes in some ESEA games, unknown strange rounds appear when sides switch with the same roundId...
                // ...it is just to make sure it does not happen...
                if (roundId !== lastRoundId) {  

                    if (Math.abs(lastRoundId - roundId) > 15) {
                        roundId = lastRoundId + 1;
                    }
    
                    console.log('Stats for round n°' + roundId + ' / Winning team: ' + winningTeam.team_name + '\n');
                    console.log('-----------------');
    
                    let multipleKills = computeMultiKills(roundKills);
            
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
    
                    roundKills = [];
                    winningTeam = {};
                    timeOut = false;
                    lastRoundTime = demoFile.currentTime - timeReference;
                    lastRoundId = roundId
                }
            }
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
