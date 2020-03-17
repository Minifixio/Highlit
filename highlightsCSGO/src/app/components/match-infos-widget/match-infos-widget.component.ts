import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatchInfos } from 'src/app/services/models/MatchInfos';
import { MapInfo } from 'src/app/services/models/MapInfo';
import { HttpService } from 'src/app/services/http.service';
import { MapInfosWidgetComponent } from '../map-infos-widget/map-infos-widget.component';

@Component({
  selector: 'app-match-infos-widget',
  templateUrl: './match-infos-widget.component.html',
  styleUrls: ['./match-infos-widget.component.scss']
})
export class MatchInfosWidgetComponent implements OnInit {

  @ViewChild('mapInfosWidget', {static: true})
  mapInfosWidget: MapInfosWidgetComponent;

  @Input() matchInfos: MatchInfos;
  @Output() mapSelected = new EventEmitter<any>();

  mapsInfos: MapInfo[];
  loading: boolean;
  winnerSide: string;
  score: Array<number>;
  mapError = false;

  constructor(
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.score = this.matchInfos.score.split('-').map(obj => parseFloat(obj));
    if (this.score[0] > this.score[1]) {
      this.winnerSide = 'left';
    } else {
      this.winnerSide = 'right';
    }
  }

  async getMaps() {
    console.log(this.matchInfos);
    if (!this.mapsInfos) {
      this.loading = true;
      this.mapsInfos = await this.httpService.getMapInfos(this.matchInfos.match_id).toPromise();
      if (this.mapsInfos.length === 0) {
        this.mapError = true;
      }
      this.loading = false;
    }
  }

  selectMap(mapInfos) {
    this.mapSelected.emit(mapInfos);
  }
}
