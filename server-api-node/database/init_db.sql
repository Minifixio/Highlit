/*sqlite3 -init init_db.sql matches.db ""*/

create table match(
    match_id INTEGER PRIMARY KEY,
    team1_id INTEGER,
    team2_id INTEGER,
    winner_team_id INTEGER,
    tournament TEXT,
    match_format TEXT,
    score TEXT,
    stars INTEGER,
    date INTERGER,
    demo_id INTEGER,
    downloaded INTEGER
);

create table maps(
    match_id INTEGER NOT NULL,
    map_number INTEGER,
    map_name TEXT,
    score TEXT,
    available INTEGER,
    winner_team_id INTEGER
);

create table team(
    team_id INTEGER PRIMARY KEY,
    team_name TEXT
);