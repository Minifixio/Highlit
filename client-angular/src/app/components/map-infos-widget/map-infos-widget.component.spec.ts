import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapInfosWidgetComponent } from './map-infos-widget.component';

describe('MapInfosWidgetComponent', () => {
  let component: MapInfosWidgetComponent;
  let fixture: ComponentFixture<MapInfosWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapInfosWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapInfosWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
