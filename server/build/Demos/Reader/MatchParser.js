"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchParser = void 0;
const RoundParser_1 = require("./RoundParser");
const DemoReadingLogger_1 = require("../../Debug/DemoReadingLogger");
class MatchParser {
    constructor(expectedRounds, matchId) {
        this.expectedRounds = expectedRounds;
        this.rounds = [];
        this.currentRound = new RoundParser_1.RoundParser(0, 0);
        this.matchLogger = new DemoReadingLogger_1.DemoReadingLogger(matchId);
    }
    startMatch() {
        this.matchLogger.matchLog('match started');
        this.rounds = [];
    }
    endMatch() {
        if (this.rounds.length === this.expectedRounds) {
            this.matchLogger.matchLog('match ended');
            this.syncRounds();
            this.matchLogger.endLogs();
            return true;
        }
        else {
            return false;
        }
    }
    roundStart(id, time) {
        if (id < this.rounds.length) {
            id = this.rounds.length + 1;
        }
        this.currentRound = new RoundParser_1.RoundParser(id, time);
        this.matchLogger.roundLog(id, 'started');
    }
    roundEnd(winner, reason, teams, time) {
        if (winner === 2) { // id n°2 means terrorists
            this.currentRound.winningTeam = {
                side: 't',
                team_name: teams[2].clanName
            };
        }
        if (winner === 3) { // else it is CTs
            this.currentRound.winningTeam = {
                side: 'ct',
                team_name: teams[3].clanName
            };
        }
        if (winner !== 2 && winner !== 3) {
            this.currentRound.winningTeam = null;
        }
        this.currentRound.endTime = time;
        this.currentRound.endReason = reason;
        this.matchLogger.roundLog(this.currentRound.roundNumber, 'ended : ' + (this.currentRound.winningTeam ? this.currentRound.winningTeam.team_name : undefined));
    }
    roundOfficiallyEnd() {
        this.currentRound.end();
        if (this.currentRound.winningTeam == null || this.currentRound.kills.length > 9) {
            this.matchLogger.matchLog('wrong round');
        }
        else {
            this.rounds.push(this.currentRound.export());
        }
    }
    halfTime() {
        this.matchLogger.matchLog('halftime');
    }
    syncRounds() {
        this.rounds.forEach(round => {
            round.round_number += 1;
            round.start = round.start - this.rounds[0].start;
        });
    }
    export() {
        return this.rounds;
    }
}
exports.MatchParser = MatchParser;
//# sourceMappingURL=MatchParser.js.map