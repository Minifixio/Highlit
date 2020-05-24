export interface DBMatchInfos {
    match_id: number;
    team1_id?: number;
    team2_id?: number;
    winner_team_id?: number;
    loser_team_id?: number;
    tournament: string;
    match_format: string;
    stars?: number;
    result: string;
    date: number;
    demo_id?: number;
    downloaded: number
}