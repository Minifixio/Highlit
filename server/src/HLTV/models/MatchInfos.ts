import { Round } from "../../Demos/models/Round";

export interface MatchInfos {
    matchId: number;
    videoId: number;
    startVideoTime: number;
    roundInfos: Round[]
}