import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchTimelineComponent } from './match-timeline.component';

describe('MatchTimelineComponent', () => {
  let component: MatchTimelineComponent;
  let fixture: ComponentFixture<MatchTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
