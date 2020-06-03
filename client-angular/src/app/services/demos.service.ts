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
    this.syncClips();
    this.router.navigate(['/match']);
  }

  syncClips() {

    this.currentDemo.rounds.forEach((item, index) => {
      if (item.round_number !== 0) { // Syncing timings from Twitch Video and match timings
        if (item.round_number === 1) { // Don't add buy time for 1st round
          this.currentDemo.rounds[index].start = this.currentDemo.startVideoTime + item.start;
        } else {
          this.currentDemo.rounds[index].start = this.currentDemo.startVideoTime + item.start + 25; // Adding 25 seconds for buy-time
          this.currentDemo.rounds[index].end = this.currentDemo.startVideoTime + item.end + 25; // Adding 25 seconds for buy-time
        }
      }
      if (item.multiple_kills) { // Same for multi kills
        item.multiple_kills.triples.forEach(triple => {
          triple.kills.forEach(kill => {
            // Removing 10 sec to make sure the clip will start fex seconds before the action
            kill.time += this.currentDemo.startVideoTime - 10;
          });
        });
        item.multiple_kills.quads.forEach(quad => {
          quad.kills.forEach(kill => {
            // Removing 10 sec to make sure the clip will start fex seconds before the action
            kill.time += this.currentDemo.startVideoTime - 10;
          });
        });
        item.multiple_kills.aces.forEach(ace => {
          ace.kills.forEach(kill => {
            // Removing 10 sec to make sure the clip will start fex seconds before the action
            kill.time += this.currentDemo.startVideoTime - 10;
          });
        });
      }

      if (item.clutch) {
        item.clutch.time += this.currentDemo.startVideoTime - 10;
      }
    });
  }
}
