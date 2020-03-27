import { MultiKill } from './MultiKill';
import { Kill } from './Kill';

export interface RoundTimelineInfos {
    round: number;
    kills: Kill[];
    duration: number;
    roundStartTime: number;
    aces: MultiKill[];
    tripleKills: MultiKill[];
    quadKills: MultiKill[];
    twitchRating: number;
    isTerrorist: boolean;
}
