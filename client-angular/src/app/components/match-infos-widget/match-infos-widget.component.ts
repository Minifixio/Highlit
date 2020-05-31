import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatchInfos } from 'src/app/models/Match/MatchInfos';
import { MapInfo } from 'src/app/models/Match/MapInfo';
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
  result: number[];
  mapError = false;

  constructor(
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    // Setting active to false because the value is actually undefined at the initialization
    if (!this.matchInfos.active) { this.matchInfos.active = false; }

    this.result = this.matchInfos.result.split('-').map(obj => parseFloat(obj));
    if (this.result[0] > this.result[1]) {
      this.winnerSide = 'left';
    } else {
      this.winnerSide = 'right';
    }
  }

  async getMaps() {
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
