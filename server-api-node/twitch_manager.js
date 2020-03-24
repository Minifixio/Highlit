/* eslint-disable no-async-promise-executor */

// Imports
var rp = require('request-promise');

// Files
var hltvManager = require("./hltv_manager.js");

var twitchClientId = 'u6xyqmq1ctnewqvsce30egzkb9ajum';

async function getTwitchComments(videoId, clipStartTime, clipEndTime) {

    return new Promise(async (resolve) => {

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

        var firstResult = await rp(options);
        totalComment = firstResult.comments.length;
        lastPacket = firstResult;

        while (lastCommentTime < clipEndTime) {
            if (lastPacket._next !== undefined) {
                tag = 'comments?cursor=' + lastPacket._next;
                options.uri = `${urlApi}/${path}/${tag}`;
                lastPacket = await rp(options);
                totalComment += lastPacket.comments.length;
                lastCommentTime = lastPacket.comments[0].content_offset_seconds;
            } else {
                break;
            }
        }

        resolve(totalComment);

    });
  }

exports.calculateTwitchRating = async function calculateTwitchRating(roundInfos, matchId, mapNumber) {
    return new Promise(async (resolve) => {
        let path = `./matches/${matchId}`;
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
            roundInfos.forEach(async(round) => {
                let startClipTime = round.start + startVideoTime;
                let endClipTime = round.end + startVideoTime;
                let twitchRating = await getTwitchComments(videoId, startClipTime, endClipTime);
                roundsRating.push(twitchRating);
                if (roundsRating.length == roundInfos.length) {
                    resolve();
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