import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndRoundReasonWidgetComponent } from './end-round-reason-widget.component';

describe('EndRoundReasonWidgetComponent', () => {
  let component: EndRoundReasonWidgetComponent;
  let fixture: ComponentFixture<EndRoundReasonWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndRoundReasonWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndRoundReasonWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
