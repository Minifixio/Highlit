import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MapInfo } from 'src/app/models/Match/MapInfo';

@Component({
  selector: 'app-map-infos-widget',
  templateUrl: './map-infos-widget.component.html',
  styleUrls: ['./map-infos-widget.component.scss']
})
export class MapInfosWidgetComponent implements OnInit {

  @Input() map: MapInfo;
  @Output() mapSelected = new EventEmitter<any>();

  globalResult: string;
  detailledResult: string;

  constructor() { }

  ngOnInit(): void {
    this.globalResult = this.map.result.slice(0, this.map.result.indexOf('('));
    this.detailledResult = this.map.result.slice(this.map.result.indexOf('('));
  }

  async selectMap() {
    this.mapSelected.emit(this.map);
  }
}
