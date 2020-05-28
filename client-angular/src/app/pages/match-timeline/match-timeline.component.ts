import { Component, OnInit, ViewChild } from '@angular/core';
import { RoundInfosWidgetComponent } from '../../components/round-infos-widget/round-infos-widget.component';
import { TwitchPlayerComponent } from '../../components/twitch-player/twitch-player.component';
import { TwitchService } from 'src/app/services/twitch.service';
import { GameInfos } from 'src/app/models/Demo/GameInfos';
import { Round } from 'src/app/models/Demo/Round';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { RoundTimelineComponent } from '../../components/round-timeline/round-timeline.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorTemplate, Errors } from 'src/app/models/Errors/Errors';

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
  gameInfos: GameInfos;
  rounds: Round[];
  roundId: number;
  playerLoading: boolean;

  currentRoundInfos: Round;

  constructor(
    private twitchService: TwitchService,
    private httpService: HttpService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.twitchService.gameInfos) {
      this.gameInfos = this.twitchService.gameInfos;
      this.rounds = this.gameInfos.roundInfos;
      this.startVideoTime = this.gameInfos.startVideoTime;
      this.playerLoading = true;

      this.syncClips();
      this.twitchPlayer.displayTwitchVideo(this.gameInfos.videoId, this.startVideoTime).then(() => {
        this.playerLoading = false;
      });
    } else {
      this.router.navigate(['/match-selection']);
    }
  }

  syncClips() {

    this.rounds.forEach((item, index) => {
      if (item.round_number !== 0) { // Syncing timings from Twitch Video and match timings
        if (item.round_number === 1) { // Don't add buy time for 1st round
          this.rounds[index].start = this.startVideoTime + item.start;
        } else {
          this.rounds[index].start = this.startVideoTime + item.start + 25; // Adding 25 seconds for buy-time
          this.rounds[index].end = this.startVideoTime + item.end + 25; // Adding 25 seconds for buy-time
        }
      }
      if (item.multiple_kills) { // Same for multi kills
        item.multiple_kills.triples.forEach(triple => {
          triple.kills.forEach(kill => {
            kill.time += this.startVideoTime - 10; // Removing 10 sec to make sure the clip will start fex seconds before the action
          });
        });
        item.multiple_kills.quads.forEach(quad => {
          quad.kills.forEach(kill => {
            kill.time += this.startVideoTime - 10; // Removing 10 sec to make sure the clip will start fex seconds before the action
          });
        });
        item.multiple_kills.aces.forEach(ace => {
          ace.kills.forEach(kill => {
            kill.time += this.startVideoTime - 10; // Removing 10 sec to make sure the clip will start fex seconds before the action
          });
        });
      }

      if (item.clutch) {
        item.clutch.time += this.startVideoTime - 10;
      }
    });
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
