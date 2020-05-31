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
exports.calculateTwitchRating = void 0;
const hltvMngr = __importStar(require("../HLTV/HLTVManager"));
const CREDENTIALS = __importStar(require("../CREDENTIALS"));
const twitchAnalyser = __importStar(require("twitch-video-comments-analyser"));
const twitchClientId = CREDENTIALS.twitchClientId;
const commentAnalyser = new twitchAnalyser.CommentAnalyser(twitchClientId, false);
function calculateTwitchRating(rounds, path, mapNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const twitchJSONfile = require(`${path}/twitch_infos.json`);
        let roundsRating = [];
        let twitchLink;
        if (mapNumber === 1) {
            twitchLink = twitchJSONfile.map1[0].link;
        }
        else {
            twitchLink = twitchJSONfile["map" + mapNumber][0].link;
        }
        const twitchLinkParsed = hltvMngr.parseTwitchLink(twitchLink);
        const startVideoTime = twitchLinkParsed.startVideoTime;
        const videoId = twitchLinkParsed.videoId;
        for (const round of rounds) {
            // Don't compute the last round rating because it is usually biased with abundance of 'GG!'
            if (round.round_number === rounds[rounds.length - 1].round_number) {
                break;
            }
            try {
                const comments = yield commentAnalyser.getComments(videoId, startVideoTime + round.start, startVideoTime + round.end);
                roundsRating.push(comments.length);
            }
            catch (e) {
                throw e;
            }
        }
        const max = Math.max.apply(Math, roundsRating);
        roundsRating = roundsRating.map(rating => Math.round((rating * 100) / max));
        rounds.forEach((round, index) => {
            round.twitch_rating = roundsRating[index];
        });
        return rounds;
    });
}
exports.calculateTwitchRating = calculateTwitchRating;
//# sourceMappingURL=TwitchManager.js.map