import * as hltvMngr from '../HLTV/HLTVManager'
import * as CREDENTIALS from '../CREDENTIALS'
import * as twitchAnalyser from 'twitch-video-comments-analyser'
import { Round } from '../Demos/models/Round';

const twitchClientId = CREDENTIALS.twitchClientId
const commentAnalyser = new twitchAnalyser.CommentAnalyser(twitchClientId, false)

export async function calculateTwitchRating(rounds: Round[], path: string, mapNumber: number): Promise<Round[]> {
    const twitchJSONfile = require(`${path}/twitch_infos.json`);
    let roundsRating: number[] = [];
    let twitchLink: string;

    if (mapNumber === 1) {
        twitchLink = twitchJSONfile.map1[0].link;
    } else {
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
            const comments = await commentAnalyser.getComments(videoId, startVideoTime + round.start, startVideoTime + round.end)
            roundsRating.push(comments.length)
        } catch(e) {
            throw e
        }
    }

    const max = Math.max.apply(Math, roundsRating);
    roundsRating = roundsRating.map(rating => Math.round((rating * 100) / max));

    rounds.forEach((round, index) => {
        round.twitch_rating = roundsRating[index];
    });

    return rounds
}