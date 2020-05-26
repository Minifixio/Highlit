import * as sq from 'sqlite3'
import * as hltvMgr from '../HLTV/HLTVManager'
import * as reqUtil from './utils/DBRequests'
import { HLTVMatchInfos } from '../HLTV/models/HLTVMatchInfos';
import { DBMatchInfos } from './models/DBMatchInfos';
import { HLTVMapResult } from '../HLTV/models/HLTVMapResult';
import { DBMapInfos } from './models/DBMapInfos';
import { HLTVTeam } from '../HLTV/models/HLTVTeam';
import { Logger } from '../Debug/LoggerService'
import { HLTVMatchResult } from '../HLTV/models/HLTVMatchResult';
import { DBLastMatch } from './models/DBLastMatch';

export const matchesDB = new sq.Database(__dirname + '/db/matches.db');
export const logger = new Logger("db");

export async function addMatchInfos(matchInfos: HLTVMatchInfos): Promise<void> {

    try {
        logger.debug("Adding new match to database");

        const matchDatas: DBMatchInfos = {
            match_id: matchInfos.id,
            team1_id: matchInfos.team1.id,
            team2_id: matchInfos.team2.id,
            winner_team_id: matchInfos.winnerTeam?.id,
            loser_team_id: matchInfos.loserTeam?.id,
            tournament: matchInfos.event.name,
            match_format: matchInfos.format,
            result: matchInfos.result,
            date: matchInfos.date,
            demo_id: matchInfos.demoId,
            downloaded: matchInfos.available ?  matchInfos.available : 3
        }

        const matchQuery = `INSERT INTO match(${Object.keys(matchDatas).join(',')}) VALUES(${Object.keys(matchDatas).map(val => val = '?').join(',')})`
        await reqUtil.run(matchQuery, Object.values(matchDatas));


        const maps: HLTVMapResult[] = matchInfos.maps

        for (const map of maps) {

            const mapData: DBMapInfos = {
                match_id: matchInfos.id,
                map_number: map.number,
                map_name: map.name,
                winner_team_id: map.winnerTeamId? map.winnerTeamId : null,
                result: map.result ? map.result : '-',
                available: 0
            }

            const mapQuery = `INSERT INTO maps(${Object.keys(mapData).join(',')}) VALUES(${Object.keys(mapData).map(val => val = '?').join(',')})`
            await reqUtil.run(mapQuery, Object.values(mapData));

            logger.debug("Added map " + map.number + " infos. Map is : " + map.name);
        }

        await addTeam(matchInfos.team1);
        await addTeam(matchInfos.team2);

        logger.debug("Added match " + matchInfos.id + " infos");

    } catch(e) {
        throw e
    }

}

export async function updateMapStatus(matchId: number, mapNumber: number, status: number): Promise<void> {
    if (mapNumber === 0) {
        try {
            const mapsUpdateQuery = "UPDATE maps SET available = ? WHERE match_id = ?";
            await reqUtil.run(mapsUpdateQuery, [status, matchId])
            logger.debug("Updated maps status to " + status + " for match " + matchId);
        } catch(e) {
            throw e
        }

    } else {
        try {
            const mapUpdateQuery = "UPDATE maps SET available = ? WHERE match_id = ? AND map_number = ?";
            await reqUtil.run(mapUpdateQuery, [status, matchId, mapNumber]);
            logger.debug("Updated map " + mapNumber + " status to " + status + " for match " + matchId);
        } catch(e) {
            throw e
        }
    }
}

export async function isMatchDowloaded(matchId: number): Promise<number> {
    const matchQuery = "SELECT downloaded FROM match WHERE match_id = ?";
    try {
        const res = await reqUtil.get(matchQuery, [matchId])
        return res.downloaded
    } catch(e) {
        throw e
    }
}

export async function isMapAvailable(matchId: number, mapNumber: number): Promise<number> {
    try {
        const matchQuery = "SELECT available FROM maps WHERE match_id = ? AND map_number = ?";
        const res = await reqUtil.get(matchQuery, [matchId, mapNumber])
        return res.available
    } catch(e) {
        throw e
    }
}

export async function countMaps(matchId: number): Promise<number> {
    try {
        const mapQuery = "SELECT * FROM maps WHERE match_id = ?";
        const res = await reqUtil.all(mapQuery, [matchId])
        return res.length
    } catch(e) {
        throw e
    }
}

export async function getMapsInfos(matchId: number): Promise<HLTVMapResult[]> {
    try {
        const mapAllInfosQuery = "SELECT * FROM maps WHERE match_id = ?";
        const res = await reqUtil.all<HLTVMapResult>(mapAllInfosQuery, [matchId])
        return res
    } catch(e) {
        return e
    }
}

export async function getMatchInfos(matchId: number): Promise<HLTVMatchInfos[]> {
    try {
        const matchAllInfosQuery = "SELECT * FROM match WHERE match_id = ?";
        const res = await reqUtil.all<HLTVMatchInfos>(matchAllInfosQuery, [matchId])
        return res
    } catch(e) {
        throw e
    }
}

export async function clearMatchInfos(matchId: number): Promise<void> {
    const deleteMatchQuery = "DELETE FROM match WHERE id = ?";
    const deleteMapsQuery = "DELETE FROM maps WHERE match_id = ?";
    await reqUtil.run(deleteMatchQuery, [matchId]);
    await reqUtil.run(deleteMapsQuery, [matchId]);
}

export async function clearDatabase(): Promise<void> {
    const deleteMatchQuery = "DELETE FROM match";
    const deleteMapsQuery = "DELETE FROM maps";
    await reqUtil.run(deleteMatchQuery, []);
    await reqUtil.run(deleteMapsQuery, []);
}

export async function getLastMatches(): Promise<HLTVMatchInfos[]> {
    try {
        const lastMatchesQuery = "SELECT * FROM match ORDER BY date DESC LIMIT 15";
        const res = await reqUtil.all<HLTVMatchInfos>(lastMatchesQuery, [])
        return res
    } catch(e) {
        throw e
    }
}

export async function getLastMatchByDate(startDate: number, endDate: number): Promise<DBLastMatch[]> {
    try {
        const lastMatchesQuery = "SELECT m.match_id, m.team1_id, m.team2_id, m.winner_team_id, m.tournament, m.match_format, m.result, m.stars, m.date, m.demo_id, m.downloaded, t1.team_name as team1_name, t2.team_name as team2_name FROM match m, team t1, team t2 WHERE date < ? AND date > ? AND t1.team_id = m.team1_id AND t2.team_id = m.team2_id ORDER BY date";
        const res = await reqUtil.all<DBLastMatch>(lastMatchesQuery, [startDate, endDate])
        return res
    } catch(e) {
        throw e
    }
}

export async function addLastMatches(lastMatches: HLTVMatchResult[]): Promise<void> {
    try {

        for (const match of lastMatches) {

            const matchDatas: DBMatchInfos = {
                match_id: match.id,
                team1_id: match.team1.id,
                team2_id: match.team2.id,
                tournament: match.event.name,
                match_format: match.format,
                result: match.result,
                date: match.date,
                stars: match.stars,
                downloaded: 0
            }

            // 'OR IGNORE' means that if the match already exists, we don't add it
            const matchQuery = `INSERT OR IGNORE INTO match(${Object.keys(matchDatas).join(',')}) VALUES(${Object.keys(matchDatas).map(val => val = '?').join(',')})`;
            await reqUtil.run(matchQuery, Object.values(matchDatas));
            await addTeam(match.team1);
            await addTeam(match.team2);
        }

        logger.debug("Added last matches to DB");

    } catch(e) {
        throw e
    }
}

export async function updateMatchStatus(matchId: number, status: number): Promise<void> {
    try {
        const statusQuery = "UPDATE match SET downloaded = ? WHERE match_id = ?";
        await reqUtil.run(statusQuery, [status, matchId])
        logger.debug("Updated match status to " + status + " for match " + matchId);
    } catch(e) {
        throw e
    }
}

export async function updateMatchInfos(matchInfos: HLTVMatchInfos): Promise<void> {
    try {

        // Adding demo_id for future downloads
        const updateQuery = "UPDATE match SET demo_id = ?, winner_team_id = ?, downloaded = ? WHERE match_id = ?";
        await reqUtil.run(updateQuery, [matchInfos.demoId, matchInfos.winnerTeam?.id, matchInfos.available, matchInfos.id]);

        if (matchInfos.maps.length > 0) {

            for (const map of matchInfos.maps) {

                const mapData: DBMapInfos = {
                    match_id: matchInfos.id,
                    map_number: map.number,
                    map_name: map.name,
                    result: map.result ? map.result : '-',
                    available: 0
                }

                const mapQuery = `INSERT INTO maps(${Object.keys(mapData).join(',')}) VALUES(${Object.keys(mapData).map(val => val = '?').join(',')})`
                await reqUtil.run(mapQuery, Object.values(mapData));
            }
        }

    } catch(e) {
        throw e
    }
}

// To check if the match already EXISTS in the match table
export async function matchExists(matchId: number): Promise<boolean> {
    try {
        const statusQuery = "SELECT * FROM match WHERE match_id = ?";
        const res = await reqUtil.all(statusQuery, [matchId])

        if (res.length === 0) {
            logger.debug("Match " + matchId + " does not exist");
            return false
        } else {
            logger.debug("Match " + matchId + " exists");
            return true
        }
    } catch(e) {
        throw e
    }
}

// If the match has demos, it also means his TwitchInfosJSON has already been created as well
export async function matchHasDemos(matchId: number): Promise<boolean> {
    try {
        const statusQuery = "SELECT demo_id FROM match WHERE match_id = ?";
        const req = await reqUtil.get(statusQuery, [matchId])

        if (!req) {
            return false;
        }

        if (req.demo_id === null) {
            return false;
        } else {
            return true;
        }

    } catch(e) {
        throw e
    }
}

export async function getMatchDemoId(matchId: number): Promise<number> {
    try {
        const statusQuery = "SELECT demo_id FROM match WHERE match_id = ?";
        const req = await reqUtil.get(statusQuery, [matchId])
        return req.demo_id
    } catch(e) {
        throw e
    }
}

export async function lastUndownloadedMatch(): Promise<number> {
    try {
        const undownloadedQuery = "SELECT match_id FROM match WHERE downloaded = 0 ORDER BY date LIMIT 1";
        const req = await reqUtil.get(undownloadedQuery, [])

        if (req) {
            return req.match_id
        } else {
            return 0
        }
    } catch(e) {
        throw e
    }
}

export async function findMatchDate(matchId: number): Promise<number> {
    try {
        const dateQuery = "SELECT date FROM match WHERE match_id = ?";
        const req = await reqUtil.get(dateQuery, [matchId])
        return req.date
    } catch(e) {
        throw e
    }
}

export async function getAllMatches(): Promise<HLTVMatchInfos[]> {
    try {
        const dateQuery = "SELECT * FROM match";
        const req = await reqUtil.all<HLTVMatchInfos>(dateQuery, [])
        return req
    } catch(e) {
        throw e
    }
}

export async function findTeamName(teamId: number): Promise<string> {
    try {
        const getTeamByIdQuery = "SELECT team_name FROM team WHERE team_id = ?"
        const req = await reqUtil.get(getTeamByIdQuery, [teamId])
        return req.team_name
    } catch(e) {
        throw e
    }
}

export async function lastUnavailableMatch(): Promise<HLTVMatchInfos | null> {
    try {
        const undownloadedQuery = "SELECT * FROM match WHERE downloaded = 3 ORDER BY date LIMIT 1";
        const req = await reqUtil.all<HLTVMatchInfos>(undownloadedQuery, [])
        if (req) {
            return req[0]
        } else {
            return null
        }

    } catch(e) {
        throw e
    }
}

export async function findMapScore(matchId: number, mapNumber: number): Promise<string> {
    try {
        const getMapScore = "SELECT result FROM maps WHERE match_id = ? AND map_number = ?"
        const req = await reqUtil.get(getMapScore, [matchId, mapNumber])
        return req.result
    } catch(e) {
        throw e
    }
}

export async function hasMapsWinnerId(matchId: number): Promise<boolean> {
    try {
        const winnerIdRequest = "SELECT winner_team_id FROM maps WHERE match_id = ?"
        const req = await reqUtil.all<{winner_team_id: string}>(winnerIdRequest, [matchId])

        if (req.filter(el => !el.winner_team_id).length > 0) {
            return false
        } else {
            return true
        }

    } catch(e) {
        throw e
    }
}

export async function updateMapsWinnerId(matchId: number): Promise<void> {
    try {
        const mapsInfos = await getMapsInfos(matchId);

        const mapTeamsRequest = "SELECT winner_team_id, team1_id, team2_id FROM match WHERE match_id = ?";
        const req = await reqUtil.get(mapTeamsRequest, [matchId])

        const winnerId = req.winner_team_id;
        let loserId: number
        winnerId === req.team1_id ? loserId = req.team2_id : loserId = req.team1_id;

        const maps = hltvMgr.getMapWinner(mapsInfos, winnerId, loserId);

        for (const map of maps) {
            await setMapWinnerId(matchId, map.number, map.winnerTeamId)
        }
    } catch(e) {
        throw e
    }
}

async function setMapWinnerId(matchId: number, mapNumber: number, winnerId?: number): Promise<void> {
    const updateWinnerRequest = "UPDATE maps SET winner_team_id = ? WHERE match_id = ? AND map_number = ?";
    await reqUtil.run(updateWinnerRequest, [winnerId, matchId, mapNumber])
}

async function addTeam(team: HLTVTeam): Promise<void> {
    const teamQuery = "INSERT OR IGNORE INTO team(team_id, team_name) VALUES(?, ?)";
    await reqUtil.run(teamQuery, [team.id, team.name]);
}