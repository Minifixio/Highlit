export interface DBMapInfos {
    match_id: number;
    map_number: number;
    map_name: string;
    score: string;
    available: number;
    winner_team_id?: number | null;
}