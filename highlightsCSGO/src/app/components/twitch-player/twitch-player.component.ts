import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
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

  constructor() { }

  ngOnInit(): void {
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
    console.log('seekTo()', timestamp);
    this.twitchPlayer.pause();
    this.twitchPlayer.seek(timestamp);
  }

  getCurrentTime() {
    console.log(this.startVideoTime, this.twitchPlayer.getCurrentTime());
  }

  onResize() {
    const twitchIframe = document.querySelectorAll('iframe')[0];
    twitchIframe.width = (window.innerWidth - 300).toString();
  }

}
