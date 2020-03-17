import { Component, OnInit, ViewChild } from '@angular/core';
import { TwitchService } from 'src/app/services/twitch.service';
import { Router } from '@angular/router';
import { MatchInfosWidgetComponent } from '../match-infos-widget/match-infos-widget.component';
import { HttpService } from 'src/app/services/http.service';
import { Observable } from 'rxjs';
import { MatchInfos } from 'src/app/services/models/MatchInfos';
import { SocketsService } from 'src/app/services/sockets.service';

@Component({
  selector: 'app-match-selection',
  templateUrl: './match-selection.component.html',
  styleUrls: ['./match-selection.component.scss']
})
export class MatchSelectionComponent implements OnInit {

  @ViewChild('matchInfosWidget', {static: true})
  twitchPlayer: MatchInfosWidgetComponent;

  inputLink: string;
  loading = false;
  lastMatches: Observable<MatchInfos[]>;
  addingMatchSocket: any;
  mapSocket: any;
  downloadPercentage = 0;
  parsingRound = 0;

  constructor(
    private twitchService: TwitchService,
    private httpService: HttpService,
    private sockets: SocketsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lastMatches = this.httpService.get('last_matches');
  }

  async hltvLinkAdded() {
    const matchId = this.twitchService.parseHltvLink(this.inputLink);
    this.sockets.emit('add-match', matchId);
    this.addingMatchSocket = this.sockets.subscribeToSocket('add-match');
    this.addingMatchSocket.subscribe(info => {
      this.loadingStatus(info, 'add-match');
    });
  }

  async selectMap(mapInfos) {
    if (mapInfos.available === 'yes') {
      console.log('[selectMap] Map is already available');
      const gameInfos = await this.httpService.getGameInfos(mapInfos.match_id, mapInfos.map_number).toPromise();
      this.twitchService.gameInfos = gameInfos;
      this.router.navigate(['/match']);
    } else {
      console.log('[selectMap] Map is not available');
      this.sockets.emit('select-map', {match_id: mapInfos.match_id, map_number: mapInfos.map_number});
      this.mapSocket = this.sockets.subscribeToSocket('select-map');
      this.mapSocket.subscribe(info => {
        this.loadingStatus(info, 'select-map');
      });
    }
  }

  loadingStatus(loadingInfos, socket) {
    console.log(loadingInfos);
    if (loadingInfos.type === 'starting_download') {
      this.loading = true;
      this.downloadPercentage = loadingInfos.params;
    }
    if (loadingInfos.type === 'downloading') {
      this.downloadPercentage = loadingInfos.params;
    }
    if (loadingInfos.type === 'starting_parsing') {
      this.loading = true;
      this.downloadPercentage = 0;
    }
    if (loadingInfos.type === 'parsing') {
      this.parsingRound = loadingInfos.params;
    }
    if (loadingInfos.type === 'game_infos') {
      console.log(loadingInfos.params);
      this.twitchService.gameInfos = loadingInfos.params;
      this.router.navigate(['/match']);

      if (socket === 'add-match') {
        this.addingMatchSocket.unsubscribe();
      }
      if (socket === 'select-match') {
        this.mapSocket.unsubscribe();
      }
    }
  }
}
