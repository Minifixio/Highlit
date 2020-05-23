import { Kill } from "../../models/Kill"
import { WinningTeam } from "../../models/WinningTeam"
import { Round } from "../../models/Round"
import { Clutch } from "../../models/Clutch"

function computeAllClutch(rounds: Round[]) {
    rounds.map(round => round.clutch = computeClutch(round.kills, round.winning_team))
    console.log(rounds)
}

export function computeClutch(kills: Kill[], winningTeam: WinningTeam | null): Clutch | null {

    if (winningTeam == null || winningTeam.side == null) {
        return null
    }

    const winnerSide = winningTeam.side
    let teamPlayersDead = 0
    let clutch = null

    for (let i=0; i<kills.length; i++) {

        const remainingKills = kills.length - i

        if (teamPlayersDead === 4 && remainingKills >= 2) {
            clutch = {
                team: winnerSide,
                player: kills[i].attacker_name,
                vs: remainingKills,
                time: kills[i].time
            }

            break;
        }

        if (kills[i].victim_team === winnerSide) {
            teamPlayersDead += 1
        }
    }

    return clutch
}
