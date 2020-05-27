import { Kill } from './Kill';
import { MultiKills } from './MultiKills';
import { BuyInfos } from './BuyInfos';
import { Clutch } from './Clutch';

export interface RoundInfo {
    start: number;
    end: number;
    round_number: number;
    winning_team: WinningTeam;
    kills: Kill[];
    multiple_kills: MultiKills;
    buy: BuyInfos;
    round_end_reason: number;
    clutch: Clutch;
    twitch_rating: number;
}

interface WinningTeam {
    side: string;
    team_name: string;
    team_id: number;
}
