import { Component, OnInit, Input } from '@angular/core';
import { Buy } from 'src/app/models/Demo/Buy';

@Component({
  selector: 'app-buy-infos-widget',
  templateUrl: './buy-infos-widget.component.html',
  styleUrls: ['./buy-infos-widget.component.scss']
})
export class BuyInfosWidgetComponent implements OnInit {

  @Input() buyInfos: Buy;

  path = '../../../assets/img/guns_img/';

  constructor() { }

  ngOnInit(): void {
    this.buyInfos.t.url = this.findBuyImg(this.buyInfos.t.type, 't');
    this.buyInfos.ct.url = this.findBuyImg(this.buyInfos.ct.type, 'ct');
  }

  findBuyImg(type: any, team: string): string {
    let url: string;
    if (type.id === 0) {
      team === 't' ? url = this.path + 'glock.png' : url = this.path + 'usps.png';
    }
    if (type.id === 1) {
      url = this.path + 'cz.png';
    }
    if (type.id === 2) {
      url = this.path + 'mp7.png';
    }
    if (type.id === 3) {
      team === 't' ? url = this.path + 'ak47.png' : url = this.path + 'm4a4.png';
    }

    return url;
  }

}
