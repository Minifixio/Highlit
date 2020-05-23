import { Demo } from 'hltv/lib/models/Demo';
import { Event } from 'hltv/lib/models/Event';
import { HLTVTeam } from './HLTVTeam';
import { HLTVMapResult } from './HLTVMapResult';

export interface HLTVMatchInfos {
    date: number;
    id: number;
    demoId?: number;
    format: string;
    team1: HLTVTeam,
    team2: HLTVTeam,
    loserTeam: HLTVTeam | null;
    winnerTeam: HLTVTeam | null;
    team1_score: number;
    team2_score: number;
    event: Event;
    result: string;
    maps: HLTVMapResult[];
    stars?: number,
    twitchLinks: Demo[];
    available?:  number;
}