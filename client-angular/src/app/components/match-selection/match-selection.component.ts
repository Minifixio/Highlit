import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TwitchService } from 'src/app/services/twitch.service';
import { Router } from '@angular/router';
import { MatchInfosWidgetComponent } from '../match-infos-widget/match-infos-widget.component';
import { HttpService } from 'src/app/services/http.service';
import { Observable } from 'rxjs';
import { MatchInfos } from 'src/app/services/models/MatchInfos';
import { SocketsService } from 'src/app/services/sockets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapInfosWidgetComponent } from '../map-infos-widget/map-infos-widget.component';
import { MapInfo } from 'src/app/services/models/MapInfo';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';

interface MatchPerDate {
  date: string;
  matches: MatchInfos[];
}

@Component({
  selector: 'app-match-selection',
  templateUrl: './match-selection.component.html',
  styleUrls: ['./match-selection.component.scss']
})
export class MatchSelectionComponent implements OnInit {

  @ViewChild('matchInfosWidget', {static: true})
  twitchPlayer: MatchInfosWidgetComponent;

  @ViewChild('selectMapWidget', {static: true})
  selectMapWidget: MapInfosWidgetComponent;

  @ViewChild('menuBar', {static: true})
  menuBar: MenuBarComponent;

  inputLink: string;
  loading = false;
  lastMatches: Observable<MatchInfos[]>;
  addingMatchSocket: any;
  mapSocket: Observable<any>;
  downloadPercentage = 0;
  parsingRound = 0;
  mapsToSelect: Array<MapInfo>;
  currentPage = 0;
  currentDate: number;
  currentMatches: Array<MatchInfos>;
  matches: Array<MatchPerDate>;
  listLoading = false;

  constructor(
    private twitchService: TwitchService,
    private httpService: HttpService,
    private sockets: SocketsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date().valueOf();
    this.matches = [];
    this.currentMatches = [];
    this.listLoading = true;
    this.httpService.post('last_matches', {date: this.currentDate}).toPromise().then(res => {
      this.matches.push({date: new Date(this.currentDate).toDateString(), matches: res});
      this.currentMatches = res;
      this.listLoading = false;
    });
  }

  async hltvLinkAdded() {
    if (this.isLinkCorrect(this.inputLink)) {
      const matchId = this.twitchService.parseHltvLink(this.inputLink);
      await this.httpService.post('add-match', {match_id: matchId}).toPromise();
      this.mapSocket = this.sockets.subscribe('select-map');
      this.mapSocket.subscribe(info => {
        console.log('hey');
        this.loadingStatus(info);
      });
    } else {
      this.showErrorToast('Please add a correct match link. The link must come from HLTV\'s results page', null);
    }
  }

  async selectMap(mapInfos) {
    if (mapInfos.available === 'yes') {
      const gameInfos = await this.httpService.getGameInfos(mapInfos.match_id, mapInfos.map_number).toPromise();
      this.twitchService.gameInfos = gameInfos;
      this.router.navigate(['/match']);
    } else {
      this.sockets.emit('select-map', {match_id: mapInfos.match_id, map_number: mapInfos.map_number});
      this.mapSocket = this.sockets.subscribe('select-map');
      this.mapSocket.subscribe(info => {
        this.loadingStatus(info);
      });
    }
  }

  loadingStatus(loadingInfos) {
    switch (loadingInfos.type) {
      case 'starting_download':
        this.loading = true;
        this.downloadPercentage = loadingInfos.params;
        break;
      case 'downloading':
        this.loading = true;
        this.downloadPercentage = loadingInfos.params;
        break;
      case 'starting_parsing':
        this.loading = true;
        this.downloadPercentage = 0;
        break;
      case 'parsing':
        this.loading = true;
        this.parsingRound = loadingInfos.params;
        break;
      case 'map_being_downloaded':
        this.showErrorToast('Map is already being downloaded. Please wait a bit...', null);
        break;
      case 'map_being_parsed':
        this.showErrorToast('Map is already being parsed. Please wait a bit...', null);
        break;
      case 'select-map':
        this.mapsToSelect = loadingInfos.params;
        break;
      case 'match_not_downloaded':
        this.showErrorToast('Map is not available for now. It will be downloaded soon...', null);
        break;
      case 'game_infos':
        this.twitchService.gameInfos = loadingInfos.params;
        this.sockets.unsubscribe();
        this.router.navigate(['/match']);
        break;
    }
  }

  async changePage(direction) {
    const date = new Date(this.currentDate);
    this.listLoading = true;

    if (direction === 'forward') {
      if (this.currentPage === 0) {
        this.listLoading = false;
        this.currentDate = date.valueOf();
        return false;
      }
      this.currentPage = this.currentPage - 1;
      date.setDate(date.getDate() + 1);
    }
    if (direction === 'backward') {
      this.currentPage += 1;
      date.setDate(date.getDate() - 1);
    }

    const searchForMatch = new Promise((resolve) => {
      this.matches.forEach(match => {
        if (match.date === date.toDateString()) {
          this.currentMatches = match.matches;
          this.currentDate = date.valueOf();
          this.listLoading = false;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    if (!(await searchForMatch)) {
      this.currentDate = date.valueOf();
      this.httpService.post('last_matches', {date: this.currentDate}).toPromise().then(res => {
        this.matches.push({date: date.toDateString(), matches: res});
        this.currentMatches = res;
        this.listLoading = false;
      });
    }
  }

  async pickDate(event) {
    this.listLoading = true;
    const today = Date.now();
    const differenceDays = Math.trunc((today - new Date(event.value).valueOf()) / (1000 * 3600 * 24));
    this.currentPage = differenceDays;
    this.currentDate = new Date(event.value).valueOf();
    const searchedDate = new Date(event.value).toDateString();

    const searchForMatch = new Promise((resolve) => {
      this.matches.forEach(match => {
        if (match.date === searchedDate) {
          this.currentMatches = match.matches;
          this.listLoading = false;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    if (!(await searchForMatch)) {
      this.httpService.post('last_matches', {date: this.currentDate}).toPromise().then(res => {
        this.matches.push({date: searchedDate, matches: res});
        this.currentMatches = res;
        this.listLoading = false;
      });
    }
  }

  showErrorToast(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  isLinkCorrect(link: string) {
    if (!link) {
      return false;
    }
    if (link.includes('www.hltv.org/matches/')) {
      return true;
    } else {
      return false;
    }
  }

  panelClosed() {
    this.sockets.unsubscribe();
  }
}
