import { MultiKill } from './MultiKill';
import { Kill } from './Kill';

export interface RoundTimelineInfos {
    killsCount: number;
    duration: number;
    aces: Kill[];
    tripleKills: Kill[];
    quadKills: Kill[];
    twitchRating: number;
    isTerrorist: boolean;
}
