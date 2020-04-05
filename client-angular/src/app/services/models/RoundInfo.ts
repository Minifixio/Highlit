import { Kill } from '../models/Kill';
import { MultiKill } from '../models/MultiKill';

export interface RoundInfo {
    start: number;
    end: number;
    round_number: number;
    winning_team: WinnigTeam;
    kills: Kill[];
    multipleKills: MultiKill[];
    clutch: ClutchInfos;
    twitch_rating: number;
}

interface WinnigTeam {
    side: string;
    team_name: string;
}

interface ClutchInfos {
    team: string;
    player: string;
    vs: number;
    time: number;
}
