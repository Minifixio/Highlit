import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
  @Output() playerReloaded = new EventEmitter<boolean>();

  twitchPlayer: any;
  playerLoading = false;
  playerBuffering = false;
  playerTooLong = false;

  constructor() { }

  ngOnInit(): void {
    this.onResize();
  }

  displayPlayer(videoId: number, startTime: number) {
    return new Promise((resolve) => {
      this.playerLoading = true;
      const options = {
        width: window.innerWidth - 400,
        height: window.innerHeight - 35,
        video: videoId
      };
      this.twitchPlayer = new Twitch.Player('player', options);
      this.twitchPlayer.addEventListener(Twitch.Player.PLAYING, () => {
        if (this.playerLoading === true) {
          this.playerLoading = false;
          setTimeout(() => {
            this.seekTo(startTime);
            resolve();
          }, 1000);
        }
      });
    });
  }

  reloadPlayer() {
    this.playerLoading = false;
    this.playerTooLong = false;
    this.playerBuffering = false;
    this.playerReloaded.emit(true);
  }

  askForReload() {
    console.log('reloading player');
    this.playerTooLong = true;
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

  onResize() {
    const twitchIframe = document.querySelectorAll('iframe')[0];
    twitchIframe.width = (window.innerWidth - 400).toString();
    twitchIframe.height = (window.innerHeight - 35).toString();
  }

  getCurrentTime() {
    console.log(this.startVideoTime, this.twitchPlayer.getCurrentTime());
  }

}
