import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Kill } from '../../services/models/Kill';
import { MultiKill } from '../../services/models/MultiKill';
import { ClutchInfos } from '../../services/models/ClutchInfos';
import { RoundTimelineInfos } from 'src/app/services/models/RoundTimelineInfos';
import { RoundInfo } from 'src/app/services/models/RoundInfo';

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

  /**@Input() killsCount: number;
  @Input() winningTeamSide: string;
  @Input() roundId: number;
  @Input() startClipTime: number;
  @Input() endClipTime: number;
  @Input() totalRounds: number;
  @Input() twitchRating: number;
  @Input() clutch: ClutchInfos;
  @Input() multipleKills: MultiKill[];
  @Input() kills: Kill[];
  @Input() startVideoTime: number;**/
  @Input() roundInfos: RoundInfo;

  @Output() selectActionEvent = new EventEmitter<SelectActionContent>();
  @Output() selectRoundEvent = new EventEmitter<number>();

  isTerrorist: boolean;
  cardColor = '#f44336';
  aces: MultiKill[] = [];
  quads: MultiKill[] = [];
  triples: MultiKill[] = [];

  constructor() { }

  ngOnInit(): void {
    if (this.roundInfos.winning_team.side === 't') {
      this.isTerrorist = true;
      this.cardColor = '#ccba7c';
    } else {
      this.cardColor = '#5d79ae';
    }
    this.findMultipleKills();
  }

  findMultipleKills() {
    this.roundInfos.multipleKills.forEach(kill => {
      if (kill.kills.length === 3) {
        this.triples.push(kill);
      }
      if (kill.kills.length === 4) {
        this.quads.push(kill);
      }
      if (kill.kills.length === 5) {
        this.aces.push(kill);
      }
    });
  }

  sendClipTime(timestamp) {
    //this.twitchSeekToEvent.emit(timestamp);
    //this.sendRoundInfos();
  }

  /**sendRoundInfos() {
    const roundInfos = {
      roundId: this.roundId,
      kills: this.kills,
      duration: this.endClipTime - this.startClipTime,
      start: this.startClipTime,
      aces: this.aces,
      tripleKills: this.tripleKills,
      quadKills: this.quadKills,
      twitchRating: this.twitchRating,
      isTerrorist: this.isTerrorist
    };
    this.selectRoundEvent.emit(roundInfos);
    this.sendClipTime(this.startClipTime);
  }**/

  selectRound() {
    this.selectRoundEvent.emit(this.roundInfos.round_number);
  }

  selectAction(timestamp: number) {
    this.selectActionEvent.emit({roundId: this.roundInfos.round_number, timestamp});
  }

  hoverCard(hover) {
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
