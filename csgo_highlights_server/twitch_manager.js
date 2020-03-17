/* eslint-disable no-async-promise-executor */

var rp = require('request-promise');

const twitchClientId = 'u6xyqmq1ctnewqvsce30egzkb9ajum';

exports.getTwitchComments = async function getTwitchComments(videoId, clipStartTime, clipEndTime) {

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
    
    const firstResult = await rp(options);
    totalComment = firstResult.comments.length;
    lastPacket = firstResult;


    while (lastCommentTime < clipEndTime) {
        tag = 'comments?cursor=' + lastPacket._next;
        options.uri = `${urlApi}/${path}/${tag}`;
        lastPacket = await rp(options);
        console.log(lastPacket);
        totalComment += lastPacket.comments.length;
        lastCommentTime = lastPacket.comments[0].content_offset_seconds;
    }

    resolve(totalComment);

    });
  }

  function calculateTwitchRating() {
    this.allComments.next(this.comments.sort((a, b) => a - b));
  }