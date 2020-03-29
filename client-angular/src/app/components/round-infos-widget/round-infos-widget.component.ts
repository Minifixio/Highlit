import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Kill } from '../../services/models/Kill';
import { MultiKill } from '../../services/models/MultiKill';
import { RoundTimelineInfos } from 'src/app/services/models/RoundTimelineInfos';

@Component({
  selector: 'app-round-infos-widget',
  templateUrl: './round-infos-widget.component.html',
  styleUrls: ['./round-infos-widget.component.scss']
})
export class RoundInfosWidgetComponent implements OnInit {

  @Input() killsCount: number;
  @Input() winningTeamSide: string;
  @Input() roundId: number;
  @Input() startClipTime: number;
  @Input() endClipTime: number;
  @Input() totalRounds: number;
  @Input() videoId: number;
  @Input() twitchRating: number;
  @Input() multipleKills: MultiKill[];
  @Input() kills: Kill[];
  @Input() startVideoTime: number;

  @Output() multiKillEvent = new EventEmitter<number>();
  @Output() roundDisplayedInfos = new EventEmitter<RoundTimelineInfos>();

  isTerrorist: boolean;
  cardColor = '#f44336';
  tripleKills = [];
  quadKills = [];
  aces = [];
  commentsAmount: number;
  twitchRatingColor = '#585858';

  constructor(
    private httpService: HttpService
  ) { }

  ngOnInit(): void {

    if (this.winningTeamSide === 't') {
      this.isTerrorist = true;
      this.cardColor = '#ccba7c';
    } else {
      this.cardColor = '#5d79ae';
    }

    this.findMultipleKills();
  }

  findMultipleKills() {
    this.multipleKills.forEach(kill => {
      if (kill.kills.length === 3) {
        this.tripleKills.push(kill);
      }
      if (kill.kills.length === 4) {
        this.quadKills.push(kill);
      }
      if (kill.kills.length === 5) {
        this.aces.push(kill);
      }
    });
  }

  sendClipTime(timestamp) {
    this.multiKillEvent.emit(timestamp);
    this.sendRoundInfos();
  }

  sendRoundInfos() {
    const response = {
      round: this.roundId,
      kills: this.kills,
      duration: this.endClipTime - this.startClipTime,
      roundStartTime: this.startClipTime - this.startVideoTime,
      aces: this.aces,
      tripleKills: this.tripleKills,
      quadKills: this.quadKills,
      twitchRating: this.twitchRating,
      isTerrorist: this.isTerrorist
    };
    this.roundDisplayedInfos.emit(response);
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
