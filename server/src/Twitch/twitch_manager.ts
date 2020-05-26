// Files
import * as hltvMngr from '../HLTV/HLTVManager'
import * as CREDENTIALS from '../CREDENTIALS'

const twitchClientId = CREDENTIALS.twitchClientId

async function getTwitchComments(videoId: number, clipStartTime: number, clipEndTime: number) {

    return new Promise(async (resolve, reject) => {

        let totalComment = 0;
        let lastPacket = [];
        let lastCommentTime = clipStartTime;
        const urlApi =  'https://api.twitch.tv/v5';
        const path = 'videos/' + videoId;
        let tag = 'comments?content_offset_seconds=' + clipStartTime;
        let mainUrl = `${urlApi}/${path}/${tag}`;

        var options = {
            uri: mainUrl,
            headers: {
                'Client-ID': twitchClientId
            },
            json: true
        };

        try {
            var firstResult = await rp(options);
        } catch (e) {
            reject(e)
            return;
        }
        
        totalComment = firstResult.comments.length;
        lastPacket = firstResult;

        while (lastCommentTime < clipEndTime) {
            if (lastPacket._next !== undefined) {
                tag = 'comments?cursor=' + lastPacket._next;
                options.uri = `${urlApi}/${path}/${tag}`;

                // Sometimes, twitch streams are sliced in different streams.
                // Also, sometimes the streams is not working. If it is the case, the rp() will return an error
                try {
                    lastPacket = await rp(options); 
                } catch (e) {
                    reject(e)
                    return;
                }

                totalComment += lastPacket.comments.length;
                lastCommentTime = lastPacket.comments[0].content_offset_seconds;
            } else {
                break;
            }
        }

        resolve(totalComment);

    });
  }

exports.calculateTwitchRating = async function calculateTwitchRating(roundInfos, path, mapNumber) {
    return new Promise(async (resolve) => {
        const twitchJSONfile = require(`${path}/twitch_infos.json`);
        let roundsRating = [];
    
        if (mapNumber == 1) {
            var twitchLink = twitchJSONfile.map1[0].link;
        } else {
            twitchLink = twitchJSONfile["map" + mapNumber][0].link;
        }
        
        const twitchLinkParsed = hltvManager.parseTwitchLink(twitchLink);
        let startVideoTime = twitchLinkParsed.startVideoTime;
        let videoId = twitchLinkParsed.videoId;
        
        var getComments = new Promise((resolve) => { 
            roundInfos.forEach(async(round, index) => {
                let startClipTime = round.start + startVideoTime;
                let endClipTime = round.end + startVideoTime;

                try {
                    var twitchRating = await getTwitchComments(videoId, startClipTime, endClipTime);
                } catch(e) {
                    twitchRating = '/';
                }

                 /**
                 * This condition is used only for the last round
                 * because on the end the match, everyone on the stream says "gg"
                 * and it completly breaks the rating.
                 * 
                 * So, we take the previous round rating and use it for the last round.
                 * 
                 * TODO : Parse the comments and remove all of them with "GG"
                 * (anyway, on the last round, the rating is often wrong)
                 **/
                if (index == (roundInfos.length - 1)) {
                    roundsRating.push(roundsRating[index - 1]);
                    resolve();
                } else {
                    roundsRating.push(twitchRating);
                }
            });
        });

        await getComments;

        let max = Math.max.apply(Math, roundsRating);
        roundsRating = roundsRating.map(rating => Math.round((rating * 100) / max));

        roundInfos.forEach((round, index) => {
            round.twitch_rating = roundsRating[index];
        });
        resolve(roundInfos);
    });
}