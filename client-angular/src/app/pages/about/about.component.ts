import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  @ViewChild('menuBar', {static: true})
  menuBar: MenuBarComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
