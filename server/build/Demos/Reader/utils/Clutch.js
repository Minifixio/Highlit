"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeClutch = void 0;
function computeAllClutch(rounds) {
    rounds.map(round => round.clutch = computeClutch(round.kills, round.winning_team));
    console.log(rounds);
}
function computeClutch(kills, winningTeam) {
    if (winningTeam == null || winningTeam.side == null) {
        return null;
    }
    const winnerSide = winningTeam.side;
    let teamPlayersDead = 0;
    let clutch = null;
    for (let i = 0; i < kills.length; i++) {
        const remainingKills = kills.length - i;
        if (teamPlayersDead === 4 && remainingKills >= 2) {
            clutch = {
                team: winnerSide,
                player: kills[i].attacker_name,
                vs: remainingKills,
                time: kills[i].time
            };
            break;
        }
        if (kills[i].victim_team === winnerSide) {
            teamPlayersDead += 1;
        }
    }
    return clutch;
}
exports.computeClutch = computeClutch;
//# sourceMappingURL=Clutch.js.map