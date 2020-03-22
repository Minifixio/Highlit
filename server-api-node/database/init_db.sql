/*sqlite3 -init init_db.sql matches.db ""*/

create table match(
    match_id INTEGER PRIMARY KEY,
    team1 TEXT,
    team2 TEXT,
    tournament TEXT,
    match_format TEXT,
    score TEXT,
    date INTERGER,
    demo_id INTEGER,
    downloaded INTEGER
);

create table maps(
    match_id INTEGER NOT NULL,
    map_number INTEGER,
    map_name TEXT,
    score TEXT,
    available TEXT
);