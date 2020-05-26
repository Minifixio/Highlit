SELECT 
    m.match_id, 
    m.team1_id, 
    m.team2_id, 
    m.winner_team_id, 
    m.tournament, 
    m.match_format, 
    m.score, stars, 
    m.date, 
    m.demo_id, 
    m.downloaded,
    t1.team_name as team1_name,
    t2.team_name as team2_name
FROM match m, team t1, team t2
WHERE 
    date < 1586194982000 
    AND date > 1585938598000 
    AND t1.team_id = m.team1_id
    AND t2.team_id = m.team2_id
ORDER BY date