import { Round } from './Round';

export interface DemoInfos {
    matchId: number;
    videoId: number;
    startVideoTime: number;
    rounds: Round[];
}
