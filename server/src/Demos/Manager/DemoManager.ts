// Imports
import * as fs from 'fs'
import * as request from 'request'
import * as util from 'util'
import * as hltvMngr from '../../HLTV/HLTVManager'
import * as dbMngr from '../../Database/DatabaseManager'
import * as twitchMngr from '../../Twitch/TwitchManager'

import { MatchInfos } from '../../HLTV/models/MatchInfos';
import { Logger } from '../../Debug/LoggerService'
import { TwitchInfos } from '../../HLTV/models/TwitchInfos';
import { extract } from './utils/unrar'
import { DemoReader } from '../Reader/DemoReader';
import { TwitchLinks } from '../models/TwitchLinks';
import { Demo } from 'hltv/lib/models/Demo';
import { Round } from '../models/Round';
import { Errors } from '../../Errors/Errors'

// Files
const logger = new Logger("demo_manager");

// Promisify
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rmdir);
const readdir = util.promisify(fs.readdir);

export async function addMatchInfos(matchId: number): Promise<number | undefined> {
    logger.debug("Adding match")

    const hltvInfos = await hltvMngr.hltvMatchInfos(matchId);
    await dbMngr.addMatchInfos(hltvInfos);

    const twitchStreams = hltvInfos.twitchLinks;
    const mapsCount = hltvInfos.maps.length;

    await makeTwitchJSONfile(matchId, twitchStreams, mapsCount);
    await dbMngr.updateMapStatus(matchId, 0, 0);

    return hltvInfos.available
}

export async function updateMatchInfos(matchId: number): Promise<number | undefined>{
    const hltvInfos = await hltvMngr.hltvMatchInfos(matchId);

    if(hltvInfos.id) { // Is the match valid ?
        await dbMngr.updateMatchInfos(hltvInfos);
        const twitchLinks = hltvInfos.twitchLinks;
        if (hltvInfos.maps.length > 0) { await makeTwitchJSONfile(matchId, twitchLinks, hltvInfos.maps.length) }
    } else {
        logger.error(Errors.HLTV.invalid_match, `matchId: ${matchId}`)
        await dbMngr.updateMatchStatus(matchId, 3)
    }

    return hltvInfos.available
}

export async function findMatchInfos(matchId: number, mapNumber: number): Promise<MatchInfos> {
    const path = await findMatchPath(matchId);
    const matchJSONfile = require(`${path}/${matchId}-map${mapNumber}.json`);
    const twitchJSONfile = require(`${path}/twitch_infos.json`);
    let twitchLink: string;

    if (mapNumber === 1) {
        twitchLink = twitchJSONfile.map1[0].link;
    } else {
        twitchLink = twitchJSONfile["map" + mapNumber][0].link;
    }

    const twitchInfos: TwitchInfos = hltvMngr.parseTwitchLink(twitchLink);

    const response: MatchInfos = {
        matchId,
        videoId: twitchInfos.videoId,
        startVideoTime: twitchInfos.startVideoTime,
        roundInfos: matchJSONfile
    }

    return response
}

export async function dowloadDemos(matchId: number): Promise<void> {

    try {
        // Get the demo id to download the demo files
        const demoId = await dbMngr.getMatchDemoId(matchId);
        logger.debug('Download demos for match ' + matchId + ' demo id is : ' + demoId);

        // Updating match/map status to 2 meaning they are being downloaded
        await dbMngr.updateMapStatus(matchId, 0, 2);
        await dbMngr.updateMatchStatus(matchId, 2);

        // Find the match folder's path
        const path = await findMatchPath(matchId);

        // URL of the match demos from HLTV
        const fileUrl = 'http://www.hltv.org/download/demo/' + demoId;

        downloadFile(fileUrl, `${path}/${matchId}.rar`).then(async() => {
            logger.debug('Finished download for demo ' + matchId);

            // Unrar the file
            await extract(`${path}/${matchId}.rar`, `${path}/dem`,);
            logger.debug('Finished unrar for demo ' + matchId);

            // Delete the .rar file
            await unlink(`${path}/${matchId}.rar`);

            // Updating map status to 0 meaning they are downloaded but not parsed yet
            await dbMngr.updateMapStatus(matchId, 0, 0);

            // Updating match status to 1 meaning the demos are now downloaded
            await dbMngr.updateMatchStatus(matchId, 1);

        }).catch((err) => {
            throw err
        })

    } catch(err) {
        logger.debug('Aborting dodwnload demos for match ' + matchId)
        await dbMngr.updateMapStatus(matchId, 0, 4);
        await dbMngr.updateMatchStatus(matchId, 4);
        throw err
    }

}

export async function downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        let contentLength: number;
        let lastCompletedPercentage = 0;
        const length: number[] = [];

        const file = fs.createWriteStream(dest);
        const sendReq = request.get(url);

        sendReq.on('response', (response) => {
            contentLength = Number(response.headers['content-length']);
            if (response.statusCode !== 200) {
                reject('Response status was ' + response.statusCode)
            }
        });

        sendReq.on('data', (chunk) => {
            length.push(chunk.length);
            const sum = length.reduce((a, b) => a + b, 0);
            const completedPercentage = Math.round((sum / contentLength) * 100);
            if (completedPercentage !== lastCompletedPercentage) {
                if (completedPercentage % 10 === 0) { logger.debug(`${completedPercentage} % of download complete`) };
                // socketManager.socketEmit('select-map', {type: 'downloading', match_id: matchId, params: completedPercentage});
                lastCompletedPercentage = completedPercentage;
            }
        });

        sendReq.on('error', async(err) => {
            logger.error(Errors.DEMOS.download_dem_files, url)
            await unlink(dest);
            reject(err)
        });

        sendReq.pipe(file);

        file.on('finish', () => {
            file.close();
            resolve()
        });

        file.on('error', async(err) => {
            logger.error(Errors.DEMOS.extract_dem_files, url)
            await unlink(dest)
            reject(err)
        });
    })
}

export async function parseDemo(matchId: number, mapNumber: number): Promise<void> {

    // Updating map status to 2 meaning the map is being downloaded
    await dbMngr.updateMapStatus(matchId, mapNumber, 2);

    logger.debug('Parsing demo for match ' + matchId + ' map ' + mapNumber);

    // Get the path of the match folder
    const path = await findMatchPath(matchId);

    // Find all the .dem files (because sometimes .DS_STORE files corrupt the process)
    const result = await (await readdir(`${path}/dem`)).filter(file => file.includes('.dem'));
    let map: string | undefined;

    // If there is only one map, the result is the only file present
    if (mapNumber === 1 && result.length === 1) {
        map = result[0];

    // Else we look for the right file. Files are always built like team1_name-vs-team2_name-m{map_number}-{map_name}
    } else {
        const scope = `-m${mapNumber}-`;
        result.forEach(mapName => {
            if (mapName.includes(scope)) {
                map = mapName;
            }
        })
    }

    if (map === undefined || result.length === 0) {
        logger.error(Errors.DEMOS.no_demos, `match${matchId}, map ${mapNumber}`);
        await dbMngr.updateMapStatus(matchId, mapNumber, 3);
        throw new Error(Errors.DEMOS.no_demos.message)
    }

    logger.debug('Map to parse is : ' + map)

    // Find the amount of rounds played for the demo reader
    const roundsPlayed = await findMapRoundsPlayed(matchId, mapNumber);

    // New instance of demo reader
    const reader = new DemoReader(`${path}/dem/${map}`, matchId, roundsPlayed);

    // Init roundInfos as empty first
    let roundInfos: Round[] = []

    // Awaiting for the read function to process
    try {
        roundInfos = await reader.read()
    } catch(e) {
        logger.debug('Wrong parsing for map : ' + map + " for match : " + matchId);
        await dbMngr.updateMapStatus(matchId, mapNumber, 3);

        try {
            await unlink(`${path}/dem/${map}`);
        } catch(e) {
            logger.error(Errors.DEMOS.dem_files_not_deleted, path)
        }

        throw e
    }

    logger.debug('Good parsing for map : ' + map + " for match : " + matchId);

    // Computing a rating for each round based on average viewers during the livestream of the match
    // TODO : Make a function to test if twitch comments are available or no

    try {
        roundInfos = await twitchMngr.calculateTwitchRating(roundInfos, path, mapNumber);
    } catch(e) {
        logger.error(Errors.DEMOS.get_twitch_comment, `matchId: ${matchId}, map: ${mapNumber}`)
    }

    // Making the match JSON file
    try {
        await makeMatchJSONfile(matchId, mapNumber, roundInfos);
    } catch(e) {
        await dbMngr.updateMapStatus(matchId, mapNumber, 3)
        logger.error(Errors.DEMOS.make_match_json, `matchId : ${matchId}, map: ${mapNumber}`)
        throw e
    }

    // Updating map status to 1 meaning the map is now available
    await dbMngr.updateMapStatus(matchId, mapNumber, 1);

    // Deleting the dem file (really heavy files)
    try {
        await unlink(`${path}/dem/${map}`);
    } catch(e) {
        logger.error(Errors.DEMOS.dem_files_not_deleted, path)
        throw e
    }

    // If the dem file was the last one in the demos folder, we make sure to delete any left files and then delete the /dem folder
    if (result.length === 1) {
        const leftFiles = await readdir(`${path}/dem/`);

        leftFiles.forEach(async(f) => {
            try {
                await unlink(`${path}/dem/${f}`);
            } catch(e) {
                logger.error(Errors.DEMOS.dem_files_not_deleted, path)
            }
        });

        try {
            await rmdir(`${path}/dem`);
        } catch(e) {
            logger.error(Errors.DEMOS.dem_folder_not_deleted, path)
        }
    }
}

async function makeMatchJSONfile(matchId: number, mapNumber: number, rounds: Round[]): Promise<void> {
    return new Promise(async(resolve, reject) => {
        // Find the folder's path
        const path = await findMatchPath(matchId);

        // Create the JSON file
        const output = JSON.stringify(rounds);
        writeFile(`${path}/${matchId}-map${mapNumber}.json`, output, 'utf8').then(() => {
            logger.debug('Match JSON created for match ' + matchId + ' map n°' + mapNumber);
            resolve();
        }).catch(e => {
            reject(e)
        });
    })
}

// Get all the available stream links on the match page and attributes them a corresponding map
async function makeTwitchJSONfile(matchId: number, mapTwitchInfos: Demo[], mapsCount: number): Promise<void> {
    return new Promise(async(resolve, reject) => {
        const twitchInfos: TwitchLinks = {}

        // If there is only one map, all the available links are for this map
        if (mapsCount === 1) {
            twitchInfos.map1 = mapTwitchInfos;

        // If not, we search for the matching stream links. The link contain the map name like 'Map {map_number}'
        } else {
           for(let i = 1; i < (mapsCount + 1); i++) {
               const infos = mapTwitchInfos.filter(obj => obj.name.includes('Map ' + i));
               twitchInfos['map' + i] = infos;

               if (!infos) {
                    await dbMngr.updateMapStatus(matchId, i, 3)
                    logger.error(Errors.DEMOS.no_twitch_stream, `matchId: ${matchId}, map: ${i}`)
               }
           }
        }

        // Find the match folder's path
        const path = await findMatchPath(matchId);

        // Make the JSON file
        const output = JSON.stringify(mapTwitchInfos);
        writeFile(`${path}/twitch_infos.json`, output, 'utf8').then(() => {
            logger.debug('Twitch JSON created');
            resolve();
        }).catch(e => {
            logger.error(Errors.DEMOS.make_twitch_json, `path: ${path}`)
            reject(e)
        });
    })
}

async function findMatchPath(matchId: number): Promise<string> {

    try {
        const date = new Date(await dbMngr.findMatchDate(matchId));

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        let path = `./matches/${year}`;

        if (!fs.existsSync(path)) {
            await mkdir(path);
        }

        path = `./matches/${year}/${month}`;

        if (!fs.existsSync(path)) {
            await mkdir(path);
        }

        path = `./matches/${year}/${month}/${day}`;

        if (!fs.existsSync(path)) {
            await mkdir(path);
        }

        path = `./matches/${year}/${month}/${day}/${matchId}`;

        if (!fs.existsSync(path)) {
            await mkdir(path);
        }

        return path;

    } catch(e) {
        logger.error(Errors.DEMOS.create_match_path, `matchId: ${matchId}`)
        throw e
    }

}

async function findMapRoundsPlayed(matchId: number, mapNumber: number): Promise<number> {
    const score = await dbMngr.findMapScore(matchId, mapNumber);
    const rounds = score.substring(0, 5).split(":").map(e => Number(e)).reduce((a, b) => a + b);

    return(rounds);
}