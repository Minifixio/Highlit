import { RoundInfo } from './RoundInfo';

export interface GameInfos {
    matchId: number;
    videoId: number;
    startVideoTime: number;
    roundInfos: RoundInfo[];
}
