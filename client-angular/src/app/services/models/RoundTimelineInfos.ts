import { MultiKill } from './MultiKill';
import { Kill } from './Kill';

export interface RoundTimelineInfos {
    roundId: number;
    kills: Kill[];
    duration: number;
    start: number;
    aces: MultiKill[];
    tripleKills: MultiKill[];
    quadKills: MultiKill[];
    twitchRating: number;
    isTerrorist: boolean;
}
