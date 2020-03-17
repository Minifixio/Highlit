import { RoundInfo } from '../models/RoundInfo';

export interface GameInfos {
    videoId: number;
    startVideoTime: number;
    roundInfos: RoundInfo[];
}
