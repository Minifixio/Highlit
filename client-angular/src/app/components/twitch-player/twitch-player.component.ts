import { Component, OnInit, Input } from '@angular/core';
import { interval } from 'rxjs';
declare const Twitch: any;

@Component({
  selector: 'app-twitch-player',
  templateUrl: './twitch-player.component.html',
  styleUrls: ['./twitch-player.component.scss']
})
export class TwitchPlayerComponent implements OnInit {

  @Input() videoId: number;
  @Input() startVideoTime: number;

  twitchPlayer: any;
  playerLoading = false;
  playerBuffering = false;

  constructor() { }

  ngOnInit(): void {
    this.onResize();
  }

  displayTwitchVideo(videoId, startTime) {
    this.playerLoading = true;
    const options = {
      width: window.innerWidth * 0.8,
      height: window.innerHeight,
      video: videoId
    };
    this.twitchPlayer = new Twitch.Player('player', options);
    this.twitchPlayer.addEventListener(Twitch.Player.PLAYING, () => {
      if (this.playerLoading === true) {
        this.playerLoading = false;
        setTimeout(() => {
          this.seekTo(startTime);
        }, 1000);
      }
    });
  }


  seekTo(timestamp) {
    this.twitchPlayer.pause();
    const currentTime = this.twitchPlayer.getCurrentTime();
    this.twitchPlayer.seek(timestamp);
    this.twitchPlayer.play();

    const loadingInterval = interval(500);
    const testLoading = loadingInterval.subscribe(() => {
      if (currentTime === this.twitchPlayer.getCurrentTime()) {
        this.playerBuffering = true;
      } else {
        this.playerBuffering = false;
        testLoading.unsubscribe();
      }
    });

  }

  getCurrentTime() {
    console.log(this.startVideoTime, this.twitchPlayer.getCurrentTime());
  }

  onResize() {
    const twitchIframe = document.querySelectorAll('iframe')[0];
    twitchIframe.width = (window.innerWidth - 300).toString();
  }

}
