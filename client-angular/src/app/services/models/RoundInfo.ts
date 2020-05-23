import { Kill } from '../models/Kill';
import { MultiKills } from '../models/MultiKills';
import { BuyInfos } from './BuyInfos';

export interface RoundInfo {
    start: number;
    end: number;
    round_number: number;
    winning_team: WinningTeam;
    kills: Kill[];
    multiple_kills: MultiKills;
    buy: BuyInfos;
    round_end_reason: number;
    clutch: ClutchInfos;
    twitch_rating: number;
}

interface WinningTeam {
    side: string;
    team_name: string;
    team_id: number;
}

interface ClutchInfos {
    team: string;
    player: string;
    vs: number;
    time: number;
}
