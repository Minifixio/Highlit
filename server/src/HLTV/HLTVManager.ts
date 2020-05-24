// Imports
import { HLTV, ContentFilter } from 'hltv'
import { HLTVMatchInfos } from './models/HLTVMatchInfos';
import { HLTVMapResult } from './models/HLTVMapResult';
import { TwitchInfos } from './models/TwitchInfos';
import { FullTeam } from 'hltv/lib/models/FullTeam';
import { FullMatch } from 'hltv/lib/models/FullMatch';
import { Team } from 'hltv/lib/models/Team';
import { Demo } from 'hltv/lib/models/Demo';
import { Errors } from '../Errors/Errors';
import { HLTVTeam } from './models/HLTVTeam';
import { Logger } from '../Debug/LoggerService'
import * as dbMngr from '../Database/DatabaseManager'
import { HLTVMatchResult } from './models/HLTVMatchResult';
import { MatchResult } from 'hltv/lib/models/MatchResult';

// Files
const logger = new Logger("hltv");

export async function hltvMatchInfos(matchId: number): Promise<HLTVMatchInfos> {
    logger.debug('Looking for informations for match ' + matchId);
    const HLTVMatch: FullMatch = await HLTV.getMatch({id: matchId});
    let matchInfos: HLTVMatchInfos;

    const matchFormat: string = HLTVMatch.format.toLocaleLowerCase()
    const GOTVlink: string = HLTVMatch.demos.filter(demo => demo.name.toLocaleLowerCase().includes('gotv'))[0].link
    const twitchLinks: Demo[] = HLTVMatch.demos.filter(demo => demo.link.toLocaleLowerCase().includes('twitch'))

    let loserTeam: HLTVTeam | null = null
    let winnerTeam: HLTVTeam | null = null
    let team1Score: number = 0
    let team2Score: number = 0
    let format: string = 'unknown'
    let team1: HLTVTeam
    let team2: HLTVTeam
    let result: string

    let playedMaps: HLTVMapResult[] = HLTVMatch.maps.filter(map => map.statsId).map(map => { return {name: map.name, result: map.result, number: 0} as HLTVMapResult})
    let demoId: number

    if (!GOTVlink) {
        demoId = 0
        throw Errors.HLTV.no_demoid
    } else {
        demoId = Number(GOTVlink.split('/')[GOTVlink.split('/').length - 1])
    }

    if (twitchLinks.length === 0 || (twitchLinks.length < playedMaps.length)) {
        throw Errors.HLTV.no_streams
    }

    if (playedMaps.length === 0) {
        throw Errors.HLTV.no_maps
    }

    if (!HLTVMatch.team2 || !HLTVMatch.team1 || !HLTVMatch.team2.id || !HLTVMatch.team1.id) {
        throw Errors.HLTV.no_teams
    } else {
        team1 = { id: HLTVMatch.team1.id, name: HLTVMatch.team1.name }
        team2 = { id: HLTVMatch.team2.id, name: HLTVMatch.team2.name }
    }

    logger.debug('Match : ' + HLTVMatch.team1.name + ' VS ' + HLTVMatch.team2.name);

    if (HLTVMatch.winnerTeam && HLTVMatch.winnerTeam.id) {

        if (HLTVMatch.winnerTeam.id === HLTVMatch.team1?.id) {
            loserTeam = { id: HLTVMatch.team2.id, name: HLTVMatch.team2.name }
            winnerTeam = { id: HLTVMatch.team1.id, name: HLTVMatch.team1.name }
        } else {
            loserTeam = { id: HLTVMatch.team1.id, name: HLTVMatch.team1.name }
            winnerTeam = { id: HLTVMatch.team2.id, name: HLTVMatch.team2.name }
        }

        playedMaps = getMapWinner(playedMaps, winnerTeam.id, loserTeam.id)
        team1Score = playedMaps.filter(map => map.winnerTeamId === HLTVMatch.team1?.id).length
        team2Score = playedMaps.filter(map => map.winnerTeamId === HLTVMatch.team2?.id).length
    }

    if (matchFormat.includes('bo5') || matchFormat.includes('best of 5') || matchFormat.includes('5')) {
        format ='bo5'
    }

    if (matchFormat.includes('bo3') || matchFormat.includes('best of 3') || matchFormat.includes('3')) {
        format ='bo3'
    }

    if (matchFormat.includes('bo2') || matchFormat.includes('best of 2') || matchFormat.includes('2')) {
        playedMaps = getBO2winner(playedMaps, HLTVMatch.team1, HLTVMatch.team2)
        team1Score = playedMaps.filter(map => map.winnerTeamId === HLTVMatch.team1?.id).length
        team2Score = playedMaps.filter(map => map.winnerTeamId === HLTVMatch.team2?.id).length
        format ='bo2'
    }

    result = `${team1Score} - ${team2Score}`

    if (matchFormat.includes('bo1') || matchFormat.includes('best of 1') || matchFormat.includes('1')) {
        format ='bo1'
        if (playedMaps[0].result) { result = playedMaps[0].result?.substring(0, 4) }
    }

    playedMaps.reduce((acc: number, cur: HLTVMapResult) => {
        acc += 1
        cur.number = acc
        return acc
    }, 0)

    matchInfos = {
        id: HLTVMatch.id,
        demoId,
        team1,
        team2,
        team1_score: team1Score,
        team2_score: team2Score,
        winnerTeam,
        loserTeam,
        format,
        result,
        date: HLTVMatch.date,
        event: HLTVMatch.event,
        maps: playedMaps,
        twitchLinks

    }

    return matchInfos
}

export async function getMapInfos(mapId: number): Promise<void> {
    logger.debug('Looking for informations for map ' + mapId);
    const matchInfos = await HLTV.getMatch({id: mapId});
    logger.debug(matchInfos);
}

export function parseTwitchLink(twitchLink: string): TwitchInfos | null {
    const scope = twitchLink.indexOf('&t=');
    const timeCode = twitchLink.slice(scope + 3);

    let hours: number = 0;
    let minutes: number = 0;
    let seconds: number = 0;

    if(timeCode.includes('h') && timeCode.includes('m') && timeCode.includes('s')) {
        hours = Number(timeCode.split('h')[0]);
        minutes = Number(timeCode.split('m')[0].split('h')[1]);
        seconds = Number(timeCode.split('m')[1].slice(0, -1));
    }
    if(timeCode.includes('m') && timeCode.includes('s') && !timeCode.includes('h')) {
        minutes = Number(timeCode.split('m')[0]);
        seconds = Number(timeCode.split('m')[1].slice(0, -1));
    }
    if (timeCode.includes('h') && timeCode.includes('s') && !timeCode.includes('m')) {
        hours = Number(timeCode.split('h')[0]);
        seconds = Number(timeCode.split('h')[1].slice(0, -1));
    }
    if (timeCode.includes('h') && timeCode.includes('m') && !timeCode.includes('s')) {
        hours = Number(timeCode.split('h')[0]);
        minutes = Number(timeCode.split('h')[1].slice(0, -1));
    }
    if (timeCode.includes('h') && !timeCode.includes('m') && !timeCode.includes('s')) {
        hours = Number(timeCode.split('h')[0]);
    }
    if (timeCode.includes('m') && !timeCode.includes('h') && !timeCode.includes('s')) {
        minutes = Number(timeCode.split('m')[0]);
    }

    const pattern = 'video=v';
    const pos = twitchLink.indexOf(pattern) + pattern.length;
    let videoId = '';

    for (let i = pos; i < twitchLink.length; i++) {
        if (!isNaN(Number(twitchLink[i]))) {
            videoId += twitchLink[i];
        } else {
            break;
        }
    }
    // Start of the match in seconds. Minus 10 seconds because Twitch stream usually starts at 1:50
    const startVideoTime = ((+hours) * 60 * 60 + (+minutes) * 60 + (+seconds)) - 10;

    if (videoId.length > 0) {
        const twitchInfos: TwitchInfos = {
            videoId : Number(videoId),
            startVideoTime,
        };

        return twitchInfos
    } else {
        throw Errors.HLTV.no_streams
    }

}

export async function getLastMatches(): Promise<void> {
    const lastMatches: MatchResult[] = await HLTV.getResults({pages: 1, contentFilters: [ContentFilter.Demo, ContentFilter.Vod]});
    const res: HLTVMatchResult[] = []

    lastMatches.forEach(match => {
        if(match.team1.id && match.team2.id){ res.push({
            id: match.id,
            team1: {id: match.team1.id, name: match.team1.name},
            team2: {id: match.team2.id, name: match.team2.name},
            format: match.format,
            event: match.event,
            map: match.map,
            result: match.result,
            stars: match.stars,
            date: match.date,
        })}
    })

    await dbMngr.addLastMatches(res);
}

export async function getTeamInfos(id: number): Promise<FullTeam> {
    const teamInfos = await HLTV.getTeam({id});
    return teamInfos
}

export async function getMatchInfos(id: number): Promise<FullMatch> {
    const matchInfos = await HLTV.getMatch({id});
    return matchInfos
}

export function getMapWinner(maps: HLTVMapResult[], winningTeam: number, losingTeam: number | undefined): HLTVMapResult[] {

    if (!losingTeam) {
        return []
    }

    if (maps.length === 1) {
        maps[0].winnerTeamId = winningTeam;
    }

    if (maps.length === 2) {
        maps.forEach(map => {
            map.winnerTeamId = winningTeam;
        });
    }

    if (maps.length >= 3) {
        const team1maps: HLTVMapResult[] = [];
        const team2maps: HLTVMapResult[] = [];

        maps.forEach(map => {
            let result: string[];
            map.result ? result = map.result.substring(0, 5).split(":") : result = [];

            result[0] > result[1] ? team1maps.push(map) : team2maps.push(map);
        });

        if (team1maps.length > team2maps.length) {
            team1maps.map(map => map.winnerTeamId = winningTeam);
            team2maps.map(map => map.winnerTeamId = losingTeam);
        }
        if (team1maps.length < team2maps.length) {
            team2maps.map(map => map.winnerTeamId = winningTeam);
            team1maps.map(map => map.winnerTeamId = losingTeam);
        }

        maps = team1maps.concat(team2maps);
    }

    return maps;
}

function getBO2winner(maps: HLTVMapResult[], team1: Team, team2: Team): HLTVMapResult[] {
    maps.forEach(map => {
        if (!map.result) {
            return []
        }

        const result = map.result.substring(0, 5).split(":").map(val => Number(val));

        if (result[0] > result[1]) {
            map.winnerTeamId = team1.id
        } else {
            map.winnerTeamId = team2.id
        }

    });

    return maps;
}