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
exports.checkUnavailableMatch = exports.updateMatch = exports.lastMatchesTask = void 0;
const cron = __importStar(require("cron"));
const CronJob = cron.CronJob;
// Files
const hltvMngr = __importStar(require("../HLTV/HLTVManager"));
const dbMngr = __importStar(require("../Database/DatabaseManager"));
const demoMngr = __importStar(require("../Demos/Manager/DemoManager"));
const LoggerService_1 = require("../Debug/LoggerService");
const logger = new LoggerService_1.Logger("cron");
// Cron tasks
exports.lastMatchesTask = new CronJob('*/30 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    logger.debug('Starting last matches task');
    yield hltvMngr.getLastMatches();
    const lastMatchId = yield dbMngr.lastUndownloadedMatch();
    logger.debug("Last undownloaded match : " + lastMatchId);
    lastMatchId === 0 ? checkUnavailableMatch() : updateMatch(lastMatchId);
}));
function updateMatch(matchId) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield dbMngr.matchHasDemos(matchId)) === false) {
            logger.debug("Match " + matchId + " has no demoId");
            const update = yield demoMngr.updateMatchInfos(matchId);
            if (update === false) {
                logger.debug("Last match is currently not available, trying again");
                const lastMatchId = yield dbMngr.lastUndownloadedMatch();
                updateMatch(lastMatchId);
                return false;
            }
            logger.debug("Match updated successfully");
        }
        if ((yield dbMngr.isMatchDowloaded(matchId)) === 0) {
            try {
                yield demoMngr.dowloadDemos(matchId);
            }
            catch (err) {
                logger.debug('Error during the download of the demos for match ' + matchId);
                return;
            }
        }
        const mapsCount = yield dbMngr.countMaps(matchId);
        for (let mapId = 1; mapId < mapsCount + 1; mapId++) {
            try {
                yield demoMngr.parseDemo(matchId, mapId);
            }
            catch (err) {
                logger.debug('Error during the parsing of the map ' + mapId + ' for match ' + matchId);
            }
        }
    });
}
exports.updateMatch = updateMatch;
function checkUnavailableMatch() {
    return __awaiter(this, void 0, void 0, function* () {
        const lastUnavailable = yield dbMngr.lastUnavailableMatch();
        if (lastUnavailable === null) {
            return false;
        }
        else {
            const update = yield demoMngr.updateMatchInfos(lastUnavailable.id);
            if (update === true) {
                updateMatch(lastUnavailable.id);
                return;
            }
            else {
                if (update === false) {
                    const today = Date.now();
                    const matchDate = yield Number(dbMngr.findMatchDate(lastUnavailable.id));
                    if (today - matchDate > 172800000) { // 172800000 is 2 days in ms
                        yield dbMngr.updateMatchStatus(lastUnavailable.id, 4);
                    }
                    return false;
                }
            }
        }
    });
}
exports.checkUnavailableMatch = checkUnavailableMatch;
//# sourceMappingURL=CronTasks.js.map