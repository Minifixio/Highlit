/**
 * Imports
 */
const demofile = require("demofile")
const fs = require("fs")
var socketManager = require("./socket_manager.js");
var debugManager = require("./debug_manager.js");
const logger = new debugManager.logger("DemoReader");

exports.readDemo = function readDemo(demofileInput) {

    return new Promise((resolve) => {
        var timeOut = false;
        var winningTeam = {};
        var roundId = 0;
        var timeReference = 0;
        var lastRoundTime = 0;
        var roundKills = [];
        var matchInfos = [];
        var lastRoundId = 0;
        var roundEndReason;
    
        logger.debug('Reading demo: ' + demofileInput);
    
        fs.readFile(demofileInput, (err, buffer) => {
            const demoFile = new demofile.DemoFile();

            demoFile.on("end", ()=> {
                makeRoundStats();
                logger.debug('Match Ended !');
                resolve(matchInfos);
                demoFile.cancel();
            });


            /**
             * Handle teams tac/tec pauses
             */
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
                        logger.debug(
                            `Team called timeout: ${team.props.DT_Team.m_szClanTeamname}`
                        );
                        }
                    });
                }
            });


            /**
             * When a rounds starts
             */
            demoFile.gameEvents.on("round_start", () => {
                // To set the time reference to 0 when the match starts
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];

                if (terrorists.score + cts.score == 0) { // When the matchs ends or when it starts, score reset to 0

                    if (roundId < 2) {
                        logger.debug('Match is STARTING !');
                        timeReference = demoFile.currentTime;
                        lastRoundId = 0;
                        lastRoundTime = 0;
                        matchInfos = []; // Reset round match infos
                    }

                    if (roundId > 14) { // Means at least 15 rounds have been played so the match ended
                        logger.debug('Match has ENDED');
                        resolve(matchInfos);
                        demoFile.cancel();
                    }
                }

                roundKills = []; // Reset kills when the round starts
            })
    

            /**
             * This events triggers when : match starts, teams change sides, match ends
             */
            demoFile.gameEvents.on("round_announce_match_start", () => {
                /*
                * In some special demos (as ESEA), post-game phase or event game-end isn't working...
                * ...but "round_announce_match_start" seems to trigger when sides are switching and when match ends.
                */
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];
                
                if (terrorists.score + cts.score == 15) { 
                    logger.debug('Changing sides');
                }
                if (terrorists.score + cts.score > 15) {
                    logger.debug('Match has ENDED');
                    resolve(matchInfos);
                    demoFile.cancel();
                } 
                if (terrorists.score + cts.score == 0) {
                    logger.debug('Match is STARTING !');
                    lastRoundTime = 0;
                    lastRoundId = 0;
                    roundKills = [];
                    matchInfos = [];
                    timeReference = demoFile.currentTime;
                }
            });    
    

            /**
             * Handle deaths
             */
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


            /**
             * Event triggers when : bomb is defused, all players are killed or when the timer reached the end.
             */
            demoFile.gameEvents.on("round_end", e => {
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];

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

                roundEndReason = e.reason;

            });
            

            /**
             * Event triggers when a round officially ends (when the round officially stops)
             */
            demoFile.gameEvents.on("round_officially_ended", () => {
                const teams = demoFile.teams;
                const terrorists = teams[2];
                const cts = teams[3];

                if ((cts.score == 16 && terrorists.score < 15) || (terrorists.score == 16 && cts.score < 15)) {
                    makeRoundStats();
                    logger.debug('Match reached 16 points');
                    resolve(matchInfos);
                    demoFile.cancel();
                }

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

                    if (Math.abs(lastRoundId - roundId) >= 14) {
                        roundId = lastRoundId + 1;
                    }

                    // To make sure to remove the 15 sec of warmup + 15 sec because time reference resets on round 1 with +15 sec
                    if (roundId == 1) { 
                        var pastRoundTime = demoFile.currentTime - timeReference - 15;
                    } else {
                        pastRoundTime = demoFile.currentTime - timeReference;
                    }

                    socketManager.socketEmit('select-map', {type: 'parsing', params: roundId});
                    logger.debug('Stats for round n°' + roundId + ' / Winning team: ' + winningTeam.team_name + '\n');
    
                    let multipleKills = computeMultiKills(roundKills);

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
