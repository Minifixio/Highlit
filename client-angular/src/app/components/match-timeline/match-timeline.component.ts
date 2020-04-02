import { Component, OnInit, ViewChild } from '@angular/core';
import { RoundInfosWidgetComponent } from '../round-infos-widget/round-infos-widget.component';
import { TwitchPlayerComponent } from '../twitch-player/twitch-player.component';
import { TwitchService } from 'src/app/services/twitch.service';
import { GameInfos } from 'src/app/services/models/GameInfos';
import { RoundInfo } from 'src/app/services/models/RoundInfo';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { RoundTimelineComponent } from '../round-timeline/round-timeline.component';
import { RoundTimelineInfos } from 'src/app/services/models/RoundTimelineInfos';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  roundInfos: RoundInfo[];
  videoId: number;
  displayClipList = false;
  roundId: number;
  playerLoading: boolean;

  roundDisplayedInfos: RoundTimelineInfos;

  constructor(
    private twitchService: TwitchService,
    private httpService: HttpService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.twitchService.gameInfos) {
      this.gameInfos = this.twitchService.gameInfos;
      this.roundInfos = this.gameInfos.roundInfos;
      this.videoId = this.gameInfos.videoId;
      this.startVideoTime = this.gameInfos.startVideoTime;
      this.playerLoading = true;

      this.loadClips();
      this.twitchPlayer.displayTwitchVideo(this.videoId, this.startVideoTime).then(() => {
        this.playerLoading = false;
      });
    } else {
      this.router.navigate(['/match-selection']);
    }
  }

  async loadClips() {
    this.displayClipList = true;

    this.roundInfos.forEach((item, index) => {
      if (item.round_number !== 0) { // Syncing timings from Twitch Video and match timings
        if (item.round_number === 1) { // Don't add buy time for 1st round
          this.roundInfos[index].start = this.startVideoTime + item.start;
        } else {
          this.roundInfos[index].start = this.startVideoTime + item.start + 25; // Adding 25 seconds for buy-time
          this.roundInfos[index].end = this.startVideoTime + item.end + 25; // Adding 25 seconds for buy-time
        }
      }
      if (item.multipleKills) { // Same for multi kills
        item.multipleKills.forEach(multi => {
          multi.kills.forEach(kill => {
            kill.time += this.startVideoTime - 10; // Removing 10 sec to make sure the clip will start fex seconds before the action
          });
        });
      }
    });
  }

  twitchSeekTo(timestamp, roundId) {
    if (roundId !== 0) {
      this.roundId = roundId;
    }
    this.twitchPlayer.seekTo(timestamp);
  }

  getCurrentTime() {
    this.twitchPlayer.getCurrentTime();
  }

  updateRoundTimeline(roundInfos) {
    this.roundDisplayedInfos = roundInfos;
    this.roundId = roundInfos.round;
  }

  async reportIssue(errorId: number) {
    let errorMessage: string;
    switch (errorId) {
      case 1:
        errorMessage = 'Wrong twitch stream';
        break;
      case 2:
        errorMessage = 'Incorrect round timings';
        break;
      case 3:
        errorMessage = 'Multikills are wrong';
        break;
      case 4:
        errorMessage = 'Other';
        break;
    }
    await this.httpService.post('mail', {type: 'error', match_id: this.gameInfos.matchId, message: errorMessage}).toPromise();

    this.showErrorToast('Thanks for your feedback !', null);
  }

  showErrorToast(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
}
