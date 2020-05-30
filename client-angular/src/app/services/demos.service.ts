import { Injectable } from '@angular/core';
import { DemoInfos } from '../models/Demo/DemoInfos';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DemosService {

  currentDemo: DemoInfos;

  constructor(
    private router: Router
  ) { }

  parseHltvLink(hltvLink) {
    let matchId = '';
    const pattern = '/matches/';
    const pos = hltvLink.indexOf(pattern) + pattern.length;
    for (let i = pos; i < hltvLink.length; i++) {
      if (!isNaN(hltvLink[i])) {
        matchId += hltvLink[i];
      } else {
        break;
      }
    }
    return matchId;
  }

  startDemo(demo: DemoInfos) {
    this.currentDemo = demo;
    this.router.navigate(['/match']);
  }
}
