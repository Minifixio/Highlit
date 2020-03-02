import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from './http.service';
import { MatchInfos } from './models/MatchInfos';
import { RoundInfo } from './models/RoundInfo';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  matchInfos: MatchInfos;
  roundInfos: RoundInfo[];

  inputLink: string;
  videoId: number;
  startVideoTime: number;

  constructor(
    private httpService: HttpService
  ) { }

  async matchLinkAdded(twitchLink): Promise<MatchInfos> {
    return new Promise(async (resolve, reject) => {
      const timeCode = twitchLink.slice(twitchLink.length - 8);
      const hour = timeCode.split('h')[0];
      const minutes = timeCode.split('m')[0].split('h')[1];
      const seconds = timeCode.split('m')[1].slice(0, -1);

      // Start of the match in seconds. Minus 10 seconds because Twitch stream usually starts at 1:50
      this.startVideoTime = ((+hour) * 60 * 60 + (+minutes) * 60 + (+seconds)) - 10;
      this.videoId = parseInt(twitchLink.slice(twitchLink.search('videos') + 7, twitchLink.search('t=') - 1), 10);

      this.roundInfos = await this.getMatchInfos();

      this.matchInfos = {
        videoId: this.videoId,
        startVideoTime: this.startVideoTime,
        roundInfos: this.roundInfos
      };

      this.httpService.roundsCount = this.roundInfos.length;

      resolve(this.matchInfos);
    });
   }

   getMatchInfos(): Promise<RoundInfo[]> {
    return new Promise((resolve, reject) => {
      this.httpService.get('match_infos').subscribe((result: RoundInfo[]) => {
        resolve(result);
      });
    });
   }

}
