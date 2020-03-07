import { Component, OnInit } from '@angular/core';
import { TwitchService } from 'src/app/services/twitch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-selection',
  templateUrl: './match-selection.component.html',
  styleUrls: ['./match-selection.component.scss']
})
export class MatchSelectionComponent implements OnInit {

  inputLink: string;

  constructor(
    private twitchService: TwitchService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  async matchLinkAdded() {
    await this.twitchService.matchLinkAdded(this.inputLink);
    this.router.navigate(['/match']);
  }

  async hltvLinkAdded() {
    this.twitchService.hltvLinkAdded(this.inputLink);
  }
}
