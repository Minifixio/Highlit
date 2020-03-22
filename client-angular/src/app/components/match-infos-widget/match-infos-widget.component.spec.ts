import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchInfosWidgetComponent } from './match-infos-widget.component';

describe('MatchInfosWidgetComponent', () => {
  let component: MatchInfosWidgetComponent;
  let fixture: ComponentFixture<MatchInfosWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchInfosWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchInfosWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
