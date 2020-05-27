import { MultiKill } from '../Demo/MultiKill';
import { Kill } from '../Demo/Kill';

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
