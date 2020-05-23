import { MapResult } from "hltv/lib/models/MapResult";

export interface HLTVMapResult extends MapResult {
    winnerTeamId?: number;
    number: number;
}