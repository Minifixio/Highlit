import { Component, OnInit, Input } from '@angular/core';
import { Kill } from 'src/app/services/models/Kill';

@Component({
  selector: 'app-round-kills-widget',
  templateUrl: './round-kills-widget.component.html',
  styleUrls: ['./round-kills-widget.component.scss']
})
export class RoundKillsWidgetComponent implements OnInit {

  @Input() kills: Kill[];

  tKills: Kill[] = [];
  ctKills: Kill[] = [];

  constructor() { }

  ngOnInit(): void {
    this.kills.forEach(kill => {
      kill.attacker_team === 't' ? this.tKills.push(kill) : this.ctKills.push(kill);
    });
  }

}
