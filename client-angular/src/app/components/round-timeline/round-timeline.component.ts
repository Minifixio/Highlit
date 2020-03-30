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
      'width': ((((this.lineWidth * 0.95)/ this.roundInfos.kills.length)) / 2) - (40 / this.roundInfos.kills.length) - ((0.05 * this.lineWidth) / (this.roundInfos.kills.length))  + 'px',
    };
    return style;
  }
}
