import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTimelineComponent } from './round-timeline.component';

describe('RoundTimelineComponent', () => {
  let component: RoundTimelineComponent;
  let fixture: ComponentFixture<RoundTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
