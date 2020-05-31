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
exports.testCron = void 0;
const cronTasks = __importStar(require("../Cron/CronTasks"));
const LoggerService_1 = require("../Debug/LoggerService");
const dbMngr = __importStar(require("../Database/DatabaseManager"));
const hltvMngr = __importStar(require("../HLTV/HLTVManager"));
const logger = new LoggerService_1.Logger("test");
function testCron() {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug('Starting last matches task');
        yield hltvMngr.getLastMatches();
        const lastMatchId = yield dbMngr.lastUndownloadedMatch();
        logger.debug("Last undownloaded match : " + lastMatchId);
        lastMatchId === 0 ? cronTasks.checkUnavailableMatch() : cronTasks.updateMatch(lastMatchId);
    });
}
exports.testCron = testCron;
//# sourceMappingURL=TestManager.js.map