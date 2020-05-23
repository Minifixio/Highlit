import { Round } from "../../Demos/models/Round";

export interface MatchInfos {
    matchId: number;
    videoId: string;
    startVideoTime: number;
    roundInfos: Round[]
}