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

  constructor() { }

  ngOnInit(): void {
  }

  async selectMap() {
    this.mapSelected.emit(this.map);
  }
}
