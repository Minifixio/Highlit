import { Component, OnInit, Input } from '@angular/core';
import { RoundEndReasons } from 'src/app/models/Demo/RoundEndReasons';

@Component({
  selector: 'app-end-round-reason-widget',
  templateUrl: './end-round-reason-widget.component.html',
  styleUrls: ['./end-round-reason-widget.component.scss']
})
export class EndRoundReasonWidgetComponent implements OnInit {

  @Input() roundEndReason: number;
  @Input() winningTeam: string;

  url: string;
  backgroundColor: string;

  constructor() { }

  ngOnInit(): void {
    this.winningTeam === 't' ? this.backgroundColor = '#ccba7c' : this.backgroundColor = '#5d79ae';
    this.url = RoundEndReasons.get(this.roundEndReason).url;
  }

}
