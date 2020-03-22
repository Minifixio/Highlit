import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MapInfo } from 'src/app/services/models/MapInfo';
import { HttpService } from 'src/app/services/http.service';
import { TwitchService } from 'src/app/services/twitch.service';
import { Router } from '@angular/router';
import { SocketsService } from 'src/app/services/sockets.service';
import { Observable } from 'rxjs';
import { GameInfos } from 'src/app/services/models/GameInfos';

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
