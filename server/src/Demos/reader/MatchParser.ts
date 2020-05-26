import { Round } from "../models/Round"
import { RoundParser } from "./RoundParser"
import { DemoReadingLogger } from "../../Debug/DemoReadingLogger"
import { Team } from 'demofile'

export class MatchParser {

    private expectedRounds: number
    public rounds: Round[]
    public currentRound: RoundParser
    public matchLogger: DemoReadingLogger

    constructor(expectedRounds: number, matchId: number) {
        this.expectedRounds = expectedRounds
        this.rounds = []
        this.currentRound = new RoundParser(0, 0)
        this.matchLogger = new DemoReadingLogger(matchId);
    }

    startMatch(): void {
        this.matchLogger.matchLog('match started')
        this.rounds = []
    }

    endMatch(): boolean {
        if (this.rounds.length === this.expectedRounds) {
            this.matchLogger.matchLog('match ended')
            this.syncRounds()
            this.matchLogger.endLogs()
            return true
        } else {
            return false
        }
    }

    roundStart(id: number, time: number): void {
        if (id < this.rounds.length) {
            id = this.rounds.length + 1
        }

        this.currentRound = new RoundParser(id, time)
        this.matchLogger.roundLog(id, 'started')
    }

    roundEnd(winner: number, reason: number, teams: Team[], time: number): void {
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
            this.currentRound.winningTeam = null
        }

        this.currentRound.endTime = time
        this.currentRound.endReason = reason
        this.matchLogger.roundLog(this.currentRound.roundNumber, 'ended : ' + (this.currentRound.winningTeam? this.currentRound.winningTeam.team_name: undefined))
    }

    roundOfficiallyEnd(): void {
        this.currentRound.end()

        if (this.currentRound.winningTeam == null || this.currentRound.kills.length > 9) {
            this.matchLogger.matchLog('wrong round')
        } else {
            this.rounds.push(this.currentRound.export())
        }
    }

    halfTime(): void {
        this.matchLogger.matchLog('halftime')
    }

    syncRounds(): void {
        this.rounds.forEach(round => {
            round.start = round.start - this.rounds[0].start
        })
    }

    export(): Round[] {
        return this.rounds
    }
}