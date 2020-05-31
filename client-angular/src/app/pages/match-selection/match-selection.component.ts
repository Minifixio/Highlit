import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatchInfosWidgetComponent } from '../../components/match-infos-widget/match-infos-widget.component';
import { HttpService } from 'src/app/services/http.service';
import { MatchInfos } from 'src/app/models/Match/MatchInfos';
import { SocketsService } from 'src/app/services/sockets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapInfosWidgetComponent } from '../../components/map-infos-widget/map-infos-widget.component';
import { MapInfo } from 'src/app/models/Match/MapInfo';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { MatchPerDate } from 'src/app/models/Match/MatchesPerDate';
import { DemoInfos } from 'src/app/models/Demo/DemoInfos';
import { Errors } from 'src/app/models/Errors/Errors';
import { DemosService } from 'src/app/services/demos.service';

interface SocketInfos {
  type: string;
  match_id: number;
  params: any;
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
  pageLoading = false;
  listLoading = false;
  listErrorMessage = Errors.SERVER.no_matches_on_this_date.message;

  // addingMatchSocket: any;
  // mapSocket: Observable<any>;
  downloadPercentage = 0;
  parsingRound = 0;
  mapsToSelect: Array<MapInfo>;

  currentPage = 0;
  currentDate: number;
  currentMatches: MatchInfos[];
  matchesPerDate: MatchPerDate[];

  constructor(
    private httpService: HttpService,
    private sockets: SocketsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private demosService: DemosService
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date().valueOf();
    this.matchesPerDate = [];
    this.currentMatches = [];
    this.listLoading = true;
    this.httpService.post<MatchInfos[]>('last_matches', {date: this.currentDate})
    .then(res => {
      console.log(res)
      this.matchesPerDate.push({date: new Date(this.currentDate).toDateString(), matches: res});
      this.currentMatches = res;
    })
    .catch(() => {
      this.listErrorMessage = Errors.SERVER.unreachable_server.message;
    });
    this.listLoading = false;
  }

  // async hltvLinkAdded() {
  //   if (this.isLinkCorrect(this.inputLink)) {
  //     const matchId = Number(this.demosService.parseHltvLink(this.inputLink));
  //     await this.httpService.post('add-match', {match_id: matchId}).toPromise();
  //     this.mapSocket = this.sockets.subscribe('select-map');
  //     this.mapSocket.subscribe(info => {
  //       this.loadingStatus(info, matchId);
  //     });
  //   } else {
  //     this.showErrorToast('Please add a correct match link. The link must come from HLTV\'s results page', null);
  //   }
  // }

  async selectMap(mapInfos: MapInfo) {

    if (mapInfos.available === 1) {

      let demoInfos: DemoInfos;

      try {
        demoInfos = await this.httpService.post<DemoInfos>('map', {match_id: mapInfos.match_id, map_number: mapInfos.map_number});
        this.demosService.startDemo(demoInfos);
      } catch (e) {
        this.showErrorToast('Map is not available for now. It will be downloaded soon...', null);
        return;
      }

    } else {
      this.showErrorToast('Map is not available for now. It will be downloaded soon...', null);
    }
  }

  closePanels(matchId: number): void {
    this.currentMatches.forEach(match => {
      if (match.match_id === matchId) {
        match.active = true;
      } else {
        match.active = false;
      }
    });
  }

  addMap(mapInfos: MapInfo) {
    // this.sockets.emit('select-map', {match_id: mapInfos.match_id, map_number: mapInfos.map_number});
    // this.mapSocket = this.sockets.subscribe('select-map');
    // this.mapSocket.subscribe(info => {
    //   this.loadingStatus(info, mapInfos.match_id);
    // });
  }

  async changePage(direction: string) {
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


    // Parse the matchesPerDate to find the ones with the corresponding date
    // The date corresponds to the current date minus / plus one day

    const todaysMatches = this.matchesPerDate.find(match => match.date === date.toDateString());

    if (todaysMatches) {
      this.currentMatches = todaysMatches.matches;
      this.currentDate = date.valueOf();
      this.listLoading = false;
    } else {
      this.currentDate = date.valueOf();

      try {
        const lastMatches = await this.httpService.post<MatchInfos[]>('last_matches', {date: this.currentDate});
        this.matchesPerDate.push({date: date.toDateString(), matches: lastMatches});
        this.currentMatches = lastMatches;
      } catch (e) {
        this.currentMatches = [];
        this.listErrorMessage = Errors.SERVER.no_matches_on_this_date.message;
      }
      this.listLoading = false;
    }

  }

  async pickDate(event: any): Promise<void> {
    this.listLoading = true;
    const today = Date.now();
    const differenceDays = Math.trunc((today - new Date(event.value).valueOf()) / (1000 * 3600 * 24));
    this.currentPage = differenceDays;
    this.currentDate = new Date(event.value).valueOf();

    const searchedDate = new Date(event.value).toDateString();

    this.matchesPerDate.forEach(async match => {
      if (match.date === searchedDate) {
        this.currentMatches = match.matches;
        this.listLoading = false;
      } else {

        try {
          const lastMatches = await this.httpService.post<MatchInfos[]>('last_matches', {date: this.currentDate});
          this.matchesPerDate.push({date: searchedDate, matches: lastMatches});
        } catch (e) {
          this.currentMatches = [];
          this.listErrorMessage = Errors.SERVER.no_matches_on_this_date.message;
        }
        this.listLoading = false;

      }
    });
  }

  isLinkCorrect(link: string): boolean {
    if (!link) {
      return false;
    }
    if (link.includes('www.hltv.org/matches/')) {
      return true;
    } else {
      return false;
    }
  }

  getMatchStars(stars: number) {
    return ' ★ '.repeat(stars);
  }

  showErrorToast(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  panelClosed() {
    this.sockets.unsubscribe();
  }

  loadingStatus(loadingInfos: SocketInfos, matchId: number) {
    if (loadingInfos.match_id === matchId) {
      switch (loadingInfos.type) {
        case 'starting_download':
          this.pageLoading = true;
          break;
        case 'downloading':
          this.pageLoading = true;
          this.downloadPercentage = loadingInfos.params;
          break;
        case 'starting_parsing':
          this.pageLoading = true;
          this.downloadPercentage = 0;
          break;
        case 'parsing':
          this.pageLoading = true;
          this.parsingRound = loadingInfos.params;
          break;
        case 'map_being_downloaded':
          this.showErrorToast('Map is already being downloaded. Please wait a bit...', null);
          this.sockets.unsubscribe();
          break;
        case 'map_being_parsed':
          this.showErrorToast('Map is already being parsed. Please wait a bit...', null);
          this.sockets.unsubscribe();
          break;
        case 'select-map':
          this.mapsToSelect = loadingInfos.params;
          break;
        case 'match_not_downloaded':
          this.showErrorToast('Map is not available for now. It will be downloaded soon...', null);
          this.sockets.unsubscribe();
          break;
        case 'demos_not_available':
          this.showErrorToast('Sorry but the demos are not available for this match', null);
          break;
        case 'game_infos':
          this.demosService.startDemo(loadingInfos.params);
          this.sockets.unsubscribe();
          break;
      }
    }
  }
}
