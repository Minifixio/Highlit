import { RoundInfo } from '../models/RoundInfo';

export interface MatchInfos {
    videoId: number;
    startVideoTime: number;
    roundInfos: RoundInfo[];
}
