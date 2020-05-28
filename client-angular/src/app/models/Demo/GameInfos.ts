import { Round } from './Round';

export interface GameInfos {
    matchId: number;
    videoId: number;
    startVideoTime: number;
    roundInfos: Round[];
}
