import { MatchInfos } from '../../HLTV/models/MatchInfos';
export declare function addMatchInfos(matchId: number): Promise<number | undefined>;
export declare function updateMatchInfos(matchId: number): Promise<boolean>;
export declare function findMatchInfos(matchId: number, mapNumber: number): Promise<MatchInfos>;
export declare function dowloadDemos(matchId: number): Promise<void>;
export declare function downloadFile(url: string, dest: string): Promise<void>;
export declare function parseDemo(matchId: number, mapNumber: number): Promise<void>;
