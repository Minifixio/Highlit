/*sqlite3 -init dump.sql newsqlite.db ""*/

create table matches(
    id INTEGER PRIMARY KEY,
    team1 VARCHAR(50),
    team2 VARCHAR(50),
    tournament VARCHAR(50)
);

create table maps_match(
    id INTEGER NOT NULL,
    map_number INTEGER,
    map_name VARCHAR(50),
    score VARCHAR(50),
    available VARCHAR(50),
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES MATCHES(id)
);