import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from './http.service';
import { GameInfos } from '../models/Demo/GameInfos';
import { Round } from '../models/Demo/Round';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  gameInfos: GameInfos;
  roundInfos: Round[];

  inputLink: string;
  videoId: number;
  startVideoTime: number;

  constructor(
    private httpService: HttpService
  ) { }

  parseHltvLink(hltvLink) {
    let matchId = '';
    const pattern = '/matches/';
    const pos = hltvLink.indexOf(pattern) + pattern.length;
    for (let i = pos; i < hltvLink.length; i++) {
      if (!isNaN(hltvLink[i])) {
        matchId += hltvLink[i];
      } else {
        break;
      }
    }
    return matchId;
  }
}
