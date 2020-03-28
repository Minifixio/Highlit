import { Component, OnInit, Input } from '@angular/core';
import { RoundTimelineInfos } from 'src/app/services/models/RoundTimelineInfos';

@Component({
  selector: 'app-round-timeline',
  templateUrl: './round-timeline.component.html',
  styleUrls: ['./round-timeline.component.scss']
})
export class RoundTimelineComponent implements OnInit {

  @Input() roundInfos: RoundTimelineInfos;

  lineWidth: number;
  duration: number;

  constructor() { }

  ngOnInit(): void {
    this.lineWidth = document.getElementById('timeline-div').offsetWidth;
  }

  computeStyle() {
    let style = {
      'width': ((((this.lineWidth * 0.95)/ this.roundInfos.kills.length)) / 2) - (26 / this.roundInfos.kills.length) - ((0.05 * this.lineWidth) / (this.roundInfos.kills.length))  + 'px',
    };
    return style;
  }

  /**computePosition(time: number) {
    let style = {
      'margin-left': (time * this.lineWidth * 0.8) / this.duration + 'px',
    };
    return style;
  }

  updateTimeline() {
    const timeRef = this.roundInfos.kills[0].time;
    this.roundInfos.kills.forEach(round => {
      round.time = round.time - timeRef;
    });
    console.log(this.roundInfos.kills);
    this.lineWidth = document.getElementById('timeline-div').offsetWidth;
    this.duration = this.roundInfos.kills[this.roundInfos.kills.length - 1].time - this.roundInfos.kills[0].time;
  }**/
}
