import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Kill } from '../../services/models/Kill';
import { MultiKill } from '../../services/models/MultiKill';
import { ClutchInfos } from '../../services/models/ClutchInfos';
import { RoundTimelineInfos } from 'src/app/services/models/RoundTimelineInfos';
import { RoundInfo } from 'src/app/services/models/RoundInfo';
import * as round_example from './round-example.json';
import { BuyInfosWidgetComponent } from '../buy-infos-widget/buy-infos-widget.component';
import { EndRoundReasonWidgetComponent } from '../end-round-reason-widget/end-round-reason-widget.component';
import { RoundKillsWidgetComponent } from '../round-kills-widget/round-kills-widget.component';

interface SelectActionContent {
  roundId: number;
  timestamp: number;
}

@Component({
  selector: 'app-round-infos-widget',
  templateUrl: './round-infos-widget.component.html',
  styleUrls: ['./round-infos-widget.component.scss']
})
export class RoundInfosWidgetComponent implements OnInit {

  @ViewChild('buyInfosWidget', {static: true})
  buyInfosWidget: BuyInfosWidgetComponent;

  @ViewChild('endRoundReasonWidget', {static: true})
  roundEndReasonWidget: EndRoundReasonWidgetComponent;

  @ViewChild('roundKillsWidget', {static: true})
  roundKillsWidge: RoundKillsWidgetComponent;

  @Input() roundInfos: RoundInfo;

  @Output() selectActionEvent = new EventEmitter<SelectActionContent>();
  @Output() selectRoundEvent = new EventEmitter<number>();

  isTerrorist: boolean;
  cardColor = '#f44336';
  multiKill = false;

  constructor() { }

  ngOnInit(): void {
    //this.roundInfos  = (round_example  as  any).default;
    if (
      this.roundInfos.multiple_kills.triples.length > 0 ||
      this.roundInfos.multiple_kills.quads.length > 0 ||
      this.roundInfos.multiple_kills.aces.length > 0 ||
      this.roundInfos.clutch) {
        this.multiKill = true;
    }

    if (this.roundInfos.winning_team.side === 't') {
      this.isTerrorist = true;
      this.cardColor = '#ccba7c';
    } else {
      this.cardColor = '#5d79ae';
    }
  }

  selectRound() {
    this.selectRoundEvent.emit(this.roundInfos.round_number);
  }

  selectAction(timestamp: number) {
    this.selectActionEvent.emit({roundId: this.roundInfos.round_number, timestamp});
  }

  hoverCard(hover: boolean) {
    if (hover) {
      this.cardColor = '#f44336';
    } else {
      if (this.isTerrorist) {
        this.cardColor = '#ccba7c';
      } else {
        this.cardColor = '#5d79ae';
      }
    }
  }
}
