export interface DBLastMatch {
    match_id: number;
    team1_id: number;
    team2_id: number;
    team1_name: string;
    team2_name: string;
    winner_team_id?: number;
    tournament: string;
    match_format: string;
    stars: number;
    result: string;
    date: number;
    demo_id: number;
    downloaded: number;
}
