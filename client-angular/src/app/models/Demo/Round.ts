import { Kill } from './Kill';
import { MultipleKills } from './MultipleKills';
import { Buy } from './Buy';
import { Clutch } from './Clutch';
import { WinningTeam } from './WinningTeam';

export interface Round {
    start: number;
    end: number;
    round_number: number;
    winning_team: WinningTeam | null;
    kills: Kill[];
    multiple_kills: MultipleKills;
    buy: Buy | null;
    end_reason: number;
    clutch: Clutch | null;
    twitch_rating: number | null;
}

