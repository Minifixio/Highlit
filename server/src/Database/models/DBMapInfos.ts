export interface DBMapInfos {
    match_id: number;
    map_number: number;
    map_name: string;
    result: string;
    available: number;
    winner_team_id?: number | null;
}