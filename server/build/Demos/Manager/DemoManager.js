"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDemo = exports.downloadFile = exports.dowloadDemos = exports.findMatchInfos = exports.updateMatchInfos = exports.addMatchInfos = void 0;
// Imports
const fs = __importStar(require("fs"));
const request = __importStar(require("request"));
const util = __importStar(require("util"));
const hltvMngr = __importStar(require("../../HLTV/HLTVManager"));
const dbMngr = __importStar(require("../../Database/DatabaseManager"));
const twitchMngr = __importStar(require("../../Twitch/TwitchManager"));
const LoggerService_1 = require("../../Debug/LoggerService");
const unrar_1 = require("./utils/unrar");
const DemoReader_1 = require("../Reader/DemoReader");
const Errors_1 = require("../../Errors/Errors");
// Files
const logger = new LoggerService_1.Logger("demo_manager");
// Promisify
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rmdir);
const readdir = util.promisify(fs.readdir);
function addMatchInfos(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug("Adding match");
        const hltvInfos = yield hltvMngr.hltvMatchInfos(matchId);
        yield dbMngr.addMatchInfos(hltvInfos);
        const twitchStreams = hltvInfos.twitchLinks;
        const mapsCount = hltvInfos.maps.length;
        yield makeTwitchJSONfile(matchId, twitchStreams, mapsCount);
        yield dbMngr.updateMapStatus(matchId, 0, 0);
        return hltvInfos.available;
    });
}
exports.addMatchInfos = addMatchInfos;
function updateMatchInfos(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        let hltvInfos;
        try {
            hltvInfos = yield hltvMngr.hltvMatchInfos(matchId);
            if (hltvInfos.id) { // Is the match valid ?
                yield dbMngr.updateMatchInfos(hltvInfos);
                const twitchLinks = hltvInfos.twitchLinks;
                if (hltvInfos.maps.length > 0) {
                    yield makeTwitchJSONfile(matchId, twitchLinks, hltvInfos.maps.length);
                }
                return true;
            }
            else {
                logger.error(Errors_1.Errors.HLTV.invalid_match, `matchId: ${matchId}`);
                yield dbMngr.updateMatchStatus(matchId, 3);
                return false;
            }
        }
        catch (e) {
            logger.error(e);
            return false;
        }
    });
}
exports.updateMatchInfos = updateMatchInfos;
function findMatchInfos(matchId, mapNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const path = yield findMatchPath(matchId);
            const matchDatas = JSON.parse(fs.readFileSync(`${path}/${matchId}-map${mapNumber}.json`, 'utf8'));
            const twitchDatas = JSON.parse(fs.readFileSync(`${path}/twitch_infos.json`, 'utf8'));
            let twitchLink;
            if (mapNumber === 1) {
                twitchLink = twitchDatas.map1[0].link;
            }
            else {
                twitchLink = twitchDatas["map" + mapNumber][0].link;
            }
            const twitchInfos = hltvMngr.parseTwitchLink(twitchLink);
            const response = {
                matchId,
                videoId: twitchInfos.videoId,
                startVideoTime: twitchInfos.startVideoTime,
                rounds: matchDatas
            };
            return response;
        }
        catch (e) {
            logger.error(Errors_1.Errors.DEMOS.find_map_infos);
            throw e;
        }
    });
}
exports.findMatchInfos = findMatchInfos;
function dowloadDemos(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the demo id to download the demo files
                const demoId = yield dbMngr.getMatchDemoId(matchId);
                logger.debug('Downloading demos for match ' + matchId + ' demo id is : ' + demoId);
                // Updating match/map status to 2 meaning they are being downloaded
                yield dbMngr.updateMapStatus(matchId, 0, 2);
                yield dbMngr.updateMatchStatus(matchId, 2);
                // Find the match folder's path
                const path = yield findMatchPath(matchId);
                // URL of the match demos from HLTV
                const fileUrl = 'http://www.hltv.org/download/demo/' + demoId;
                downloadFile(fileUrl, `${path}/${matchId}.rar`).then(() => __awaiter(this, void 0, void 0, function* () {
                    logger.debug('Finished download for demo ' + matchId);
                    // Unrar the file
                    yield unrar_1.extract(`${path}/${matchId}.rar`, `${path}/dem`);
                    logger.debug('Finished unrar for demo ' + matchId);
                    // Delete the .rar file
                    yield unlink(`${path}/${matchId}.rar`);
                    // Updating map status to 0 meaning they are downloaded but not parsed yet
                    yield dbMngr.updateMapStatus(matchId, 0, 0);
                    // Updating match status to 1 meaning the demos are now downloaded
                    yield dbMngr.updateMatchStatus(matchId, 1);
                    resolve();
                })).catch((err) => {
                    reject(err);
                });
            }
            catch (err) {
                logger.debug('Aborting dodwnload demos for match ' + matchId);
                yield dbMngr.updateMapStatus(matchId, 0, 4);
                yield dbMngr.updateMatchStatus(matchId, 4);
                reject(err);
            }
        }));
    });
}
exports.dowloadDemos = dowloadDemos;
function downloadFile(url, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let contentLength;
            let lastCompletedPercentage = 0;
            const length = [];
            const file = fs.createWriteStream(dest);
            const sendReq = request.get(url);
            sendReq.on('response', (response) => {
                contentLength = Number(response.headers['content-length']);
                if (response.statusCode !== 200) {
                    reject('Response status was ' + response.statusCode);
                }
            });
            sendReq.on('data', (chunk) => {
                length.push(chunk.length);
                const sum = length.reduce((a, b) => a + b, 0);
                const completedPercentage = Math.round((sum / contentLength) * 100);
                if (completedPercentage !== lastCompletedPercentage) {
                    if (completedPercentage % 10 === 0) {
                        logger.debug(`${completedPercentage} % of download complete`);
                    }
                    ;
                    // socketManager.socketEmit('select-map', {type: 'downloading', match_id: matchId, params: completedPercentage});
                    lastCompletedPercentage = completedPercentage;
                }
            });
            sendReq.on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                logger.error(Errors_1.Errors.DEMOS.download_dem_files, url);
                yield unlink(dest);
                reject(err);
            }));
            sendReq.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
            file.on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                logger.error(Errors_1.Errors.DEMOS.extract_dem_files, url);
                yield unlink(dest);
                reject(err);
            }));
        });
    });
}
exports.downloadFile = downloadFile;
function parseDemo(matchId, mapNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        // Updating map status to 2 meaning the map is being downloaded
        yield dbMngr.updateMapStatus(matchId, mapNumber, 2);
        logger.debug('Parsing demo for match ' + matchId + ' map ' + mapNumber);
        // Get the path of the match folder
        const path = yield findMatchPath(matchId);
        // Find all the .dem files (because sometimes .DS_STORE files corrupt the process)
        const result = yield (yield readdir(`${path}/dem`)).filter(file => file.includes('.dem'));
        let map;
        // If there is only one map, the result is the only file present
        if (mapNumber === 1 && result.length === 1) {
            map = result[0];
            // Else we look for the right file. Files are always built like team1_name-vs-team2_name-m{map_number}-{map_name}
        }
        else {
            const scope = `-m${mapNumber}-`;
            result.forEach(mapName => {
                if (mapName.includes(scope)) {
                    map = mapName;
                }
            });
        }
        if (map === undefined || result.length === 0) {
            logger.error(Errors_1.Errors.DEMOS.no_demos, `match${matchId}, map ${mapNumber}`);
            yield dbMngr.updateMapStatus(matchId, mapNumber, 3);
            throw new Error(Errors_1.Errors.DEMOS.no_demos.message);
        }
        logger.debug('Map to parse is : ' + map);
        // Find the amount of rounds played for the demo reader
        const roundsPlayed = yield findMapRoundsPlayed(matchId, mapNumber);
        // New instance of demo reader
        const reader = new DemoReader_1.DemoReader(`${path}/dem/${map}`, matchId, roundsPlayed);
        // Init roundInfos as empty first
        let roundInfos = [];
        // Awaiting for the read function to process
        try {
            roundInfos = yield reader.read();
        }
        catch (e) {
            logger.debug('Wrong parsing for map : ' + map + " for match : " + matchId);
            yield dbMngr.updateMapStatus(matchId, mapNumber, 3);
            try {
                yield unlink(`${path}/dem/${map}`);
            }
            catch (e) {
                logger.error(Errors_1.Errors.DEMOS.dem_files_not_deleted, path);
            }
            throw e;
        }
        logger.debug('Good parsing for map : ' + map + " for match : " + matchId);
        // Computing a rating for each round based on average viewers during the livestream of the match
        // TODO : Make a function to test if twitch comments are available or no
        try {
            roundInfos = yield twitchMngr.calculateTwitchRating(roundInfos, path, mapNumber);
        }
        catch (e) {
            logger.error(Errors_1.Errors.DEMOS.get_twitch_comment, `matchId: ${matchId}, map: ${mapNumber}`);
        }
        // Making the match JSON file
        try {
            yield makeMatchJSONfile(matchId, mapNumber, roundInfos);
        }
        catch (e) {
            yield dbMngr.updateMapStatus(matchId, mapNumber, 3);
            logger.error(Errors_1.Errors.DEMOS.make_match_json, `matchId : ${matchId}, map: ${mapNumber}`);
            throw e;
        }
        // Updating map status to 1 meaning the map is now available
        yield dbMngr.updateMapStatus(matchId, mapNumber, 1);
        // Deleting the dem file (really heavy files)
        try {
            yield unlink(`${path}/dem/${map}`);
        }
        catch (e) {
            logger.error(Errors_1.Errors.DEMOS.dem_files_not_deleted, path);
            throw e;
        }
        // If the dem file was the last one in the demos folder, we make sure to delete any left files and then delete the /dem folder
        if (result.length === 1) {
            const leftFiles = yield readdir(`${path}/dem/`);
            leftFiles.forEach((f) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield unlink(`${path}/dem/${f}`);
                }
                catch (e) {
                    logger.error(Errors_1.Errors.DEMOS.dem_files_not_deleted, path);
                }
            }));
            try {
                yield rmdir(`${path}/dem`);
            }
            catch (e) {
                logger.error(Errors_1.Errors.DEMOS.dem_folder_not_deleted, path);
            }
        }
    });
}
exports.parseDemo = parseDemo;
function makeMatchJSONfile(matchId, mapNumber, rounds) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            // Find the folder's path
            const path = yield findMatchPath(matchId);
            // Create the JSON file
            const output = JSON.stringify(rounds);
            writeFile(`${path}/${matchId}-map${mapNumber}.json`, output, 'utf8').then(() => {
                logger.debug('Match JSON created for match ' + matchId + ' map n°' + mapNumber);
                resolve();
            }).catch(e => {
                reject(e);
            });
        }));
    });
}
// Get all the available stream links on the match page and attributes them a corresponding map
function makeTwitchJSONfile(matchId, mapTwitchInfos, mapsCount) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const twitchInfos = {};
            // If there is only one map, all the available links are for this map
            if (mapsCount === 1) {
                twitchInfos.map1 = mapTwitchInfos;
                // If not, we search for the matching stream links. The link contain the map name like 'Map {map_number}'
            }
            else {
                for (let i = 1; i < (mapsCount + 1); i++) {
                    const infos = mapTwitchInfos.filter(obj => obj.name.includes('Map ' + i));
                    twitchInfos['map' + i] = infos;
                    if (!infos) {
                        yield dbMngr.updateMapStatus(matchId, i, 3);
                        logger.error(Errors_1.Errors.DEMOS.no_twitch_stream, `matchId: ${matchId}, map: ${i}`);
                    }
                }
            }
            // Find the match folder's path
            const path = yield findMatchPath(matchId);
            // Make the JSON file
            const output = JSON.stringify(twitchInfos);
            writeFile(`${path}/twitch_infos.json`, output, 'utf8').then(() => {
                logger.debug('Twitch JSON created');
                resolve();
            }).catch(e => {
                logger.error(Errors_1.Errors.DEMOS.make_twitch_json, `path: ${path}`);
                reject(e);
            });
        }));
    });
}
function findMatchPath(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const date = new Date(yield dbMngr.findMatchDate(matchId));
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            let path = `./matches/${year}`;
            if (!fs.existsSync(path)) {
                yield mkdir(path);
            }
            path = `./matches/${year}/${month}`;
            if (!fs.existsSync(path)) {
                yield mkdir(path);
            }
            path = `./matches/${year}/${month}/${day}`;
            if (!fs.existsSync(path)) {
                yield mkdir(path);
            }
            path = `./matches/${year}/${month}/${day}/${matchId}`;
            if (!fs.existsSync(path)) {
                yield mkdir(path);
            }
            return path;
        }
        catch (e) {
            logger.error(Errors_1.Errors.DEMOS.create_match_path, `matchId: ${matchId}`);
            throw e;
        }
    });
}
function findMapRoundsPlayed(matchId, mapNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const score = yield dbMngr.findMapScore(matchId, mapNumber);
        const rounds = score.substring(0, 5).split(":").map(e => Number(e)).reduce((a, b) => a + b);
        return (rounds);
    });
}
//# sourceMappingURL=DemoManager.js.map