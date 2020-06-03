import { Component, OnInit, ViewChild } from '@angular/core';
import { RoundInfosWidgetComponent } from '../../components/round-infos-widget/round-infos-widget.component';
import { TwitchPlayerComponent } from '../../components/twitch-player/twitch-player.component';
import { DemoInfos } from 'src/app/models/Demo/DemoInfos';
import { Round } from 'src/app/models/Demo/Round';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { RoundTimelineComponent } from '../../components/round-timeline/round-timeline.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorTemplate, Errors } from 'src/app/models/Errors/Errors';
import { DemosService } from 'src/app/services/demos.service';

interface SelectActionContent {
  roundId: number;
  timestamp: number;
}

@Component({
  selector: 'app-match-timeline',
  templateUrl: './match-timeline.component.html',
  styleUrls: ['./match-timeline.component.scss']
})

export class MatchTimelineComponent implements OnInit {

  @ViewChild('roundInfos', {static: true})
  roundInfosWidget: RoundInfosWidgetComponent;

  @ViewChild('twitchPlayer', {static: true})
  twitchPlayer: TwitchPlayerComponent;

  @ViewChild('roundTimeline', {static: true})
  roundTimeline: RoundTimelineComponent;

  startVideoTime: number;
  gameInfos: DemoInfos;
  rounds: Round[];
  roundId: number;
  playerLoading: boolean;

  currentRoundInfos: Round;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private snackBar: MatSnackBar,
    private demosService: DemosService
  ) { }

  ngOnInit(): void {
    if (this.demosService.currentDemo) {
      this.gameInfos = this.demosService.currentDemo;
      this.rounds = this.gameInfos.rounds;
      this.startVideoTime = this.gameInfos.startVideoTime;
      this.playerLoading = true;

      this.twitchPlayer.displayPlayer(this.gameInfos.videoId, this.startVideoTime).then(() => {
        this.playerLoading = false;
      });

      setTimeout(() => {
        this.twitchPlayer.reloadPlayer();
        this.playerLoading = false;
      }, 8000);

    } else {
      this.router.navigate(['/match-selection']);
    }
  }

  playerReloaded() {
    this.playerLoading = false;
  }

  twitchSeekTo(timestamp: number) {
    this.twitchPlayer.seekTo(timestamp);
  }

  updateRoundTimeline(roundInfos) {
    this.currentRoundInfos = roundInfos;
    this.roundId = roundInfos.roundId;
  }

  selectRound(roundId: number) {
    this.currentRoundInfos = this.rounds.find(round => round.round_number === roundId);
    this.roundId = roundId;
    this.twitchSeekTo(this.currentRoundInfos.start);
  }

  selectAction(actionInfos: SelectActionContent) {
    this.currentRoundInfos = this.rounds.find(round => round.round_number === actionInfos.roundId);
    this.roundId = actionInfos.roundId;
    this.twitchSeekTo(actionInfos.timestamp);
  }

  async reportIssue(errorId: number) {
    let error: ErrorTemplate;
    switch (errorId) {
      case 1:
        error = Errors.MAIL.wrong_twitch_stream;
        break;
      case 2:
        error = Errors.MAIL.incorrect_round_timings;
        break;
      case 3:
        error = Errors.MAIL.wrong_multikills;
        break;
      case 4:
        error = Errors.MAIL.other;
        break;
    }
    await this.httpService.post('mail', {type: 'error', match_id: this.gameInfos.matchId, error});
    this.showErrorToast('Thanks for your feedback !', null);
  }

  showErrorToast(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
}
