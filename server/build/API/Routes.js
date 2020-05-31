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
exports.Routes = void 0;
// Files
const hltvMngr = __importStar(require("../HLTV/HLTVManager"));
const dbMngr = __importStar(require("../Database/DatabaseManager"));
const demoMngr = __importStar(require("../Demos/Manager/DemoManager"));
const mailMngr = __importStar(require("../Mails/MailManager"));
const LoggerService_1 = require("../Debug/LoggerService");
const logger = new LoggerService_1.Logger("http");
class Routes {
    constructor(app) {
        this.app = app;
    }
    mountRoutes() {
        this.app.post('/v1/last_matches', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const date = new Date(req.body.date);
            const endDate = new Date(date);
            const startDate = new Date(date);
            const startTimecode = new Date(startDate.setDate(date.getDate())).setHours(24, 0, 0, 0);
            const endTimecode = new Date(endDate.setDate(date.getDate() - 1)).setHours(24, 0, 0, 0);
            const response = yield dbMngr.getLastMatchByDate(startTimecode, endTimecode);
            res.json(response);
        }));
        this.app.post('/v1/map', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const matchId = req.body.match_id;
            const mapNumber = req.body.map_number;
            try {
                const response = yield demoMngr.findMatchInfos(matchId, mapNumber);
                res.json(response);
            }
            catch (e) {
                console.log(e);
                res.json([]);
            }
        }));
        this.app.post('/v1/maps', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const matchId = req.body.match_id;
            const matchHasDemos = yield dbMngr.matchHasDemos(matchId);
            let response = yield dbMngr.getMapsInfos(matchId);
            if (!matchHasDemos) {
                logger.debug("Maps for match " + matchId + " does not exist");
                const update = yield demoMngr.updateMatchInfos(matchId);
                if (update === false) {
                    response = [];
                }
                if (update === true) {
                    response = yield dbMngr.getMapsInfos(matchId);
                }
            }
            const hasMapsWinnerId = yield dbMngr.hasMapsWinnerId(matchId);
            // For the old matches without winner team id for maps
            if (!hasMapsWinnerId) {
                yield dbMngr.updateMapsWinnerId(matchId);
                response = yield dbMngr.getMapsInfos(matchId);
            }
            res.json(response);
        }));
        this.app.get('/v1/refresh', (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield hltvMngr.getLastMatches();
            res.send('last matches refreshed');
        }));
        this.app.post('/v1/mail', (req, res) => {
            if (req.body.type === 'error') {
                const matchId = req.body.match_id;
                const error = req.body.error;
                mailMngr.mailError(matchId, error);
            }
            res.json(true);
        });
        // app.post('/v1/add-match', async(req, res) => {
        //     const matchId = req.body.match_id;
        //     socketManager.addMatch(matchId);
        //     res.json(true);
        // });
    }
}
exports.Routes = Routes;
//# sourceMappingURL=Routes.js.map