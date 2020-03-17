import { Component, OnInit, ViewChild } from '@angular/core';
import { RoundInfosWidgetComponent } from '../round-infos-widget/round-infos-widget.component';
import { TwitchPlayerComponent } from '../twitch-player/twitch-player.component';
import { TwitchService } from 'src/app/services/twitch.service';
import { GameInfos } from 'src/app/services/models/GameInfos';
import { RoundInfo } from 'src/app/services/models/RoundInfo';
import { RoundTimelineInfos } from 'src/app/services/models/RoundTimelineInfos';

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

  startVideoTime: number;
  gameInfos: GameInfos;
  roundInfos: RoundInfo[];
  videoId: number;
  displayClipList = false;
  openPanel = true;
  roundId = 'Select a round to play !';

  roundDisplayedInfos: RoundTimelineInfos;

  constructor(
    private twitchService: TwitchService
  ) { }

  ngOnInit(): void {
    this.gameInfos = this.twitchService.gameInfos;
    console.log(this.gameInfos);
    this.roundInfos = this.gameInfos.roundInfos;
    this.videoId = this.gameInfos.videoId;
    this.startVideoTime = this.gameInfos.startVideoTime;
    this.loadClips();
    this.twitchPlayer.displayTwitchVideo(this.videoId, this.startVideoTime);
  }

  async loadClips() {
    this.displayClipList = true;
    console.log(this.roundInfos);
    this.roundInfos.forEach((item, index) => {
      if (item.round_number !== 0) { // Syncing timings from Twitch Video and match timings
        this.roundInfos[index].start = this.startVideoTime + item.start + 25; // Adding 25 seconds for buy-time
        this.roundInfos[index].end = this.startVideoTime + item.end + 25; // Adding 25 seconds for buy-time
      }
      if (item.multipleKills) { // Same for multi kills
        item.multipleKills.forEach(multi => {
          multi.kills.forEach(kill => {
            kill.time += this.startVideoTime;
          });
        });
      }
    });
  }

  twitchSeekTo(timestamp, roundId) {
    if (roundId !== 0) {
      this.roundId = roundId;
    }
    this.openPanel = false;
    this.twitchPlayer.seekTo(timestamp);
  }

  getCurrentTime() {
    this.twitchPlayer.getCurrentTime();
  }

  updateRoundTimeline(roundInfos) {
    this.roundDisplayedInfos = roundInfos;
  }
}
