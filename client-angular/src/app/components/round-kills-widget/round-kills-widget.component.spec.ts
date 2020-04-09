import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundKillsWidgetComponent } from './round-kills-widget.component';

describe('RoundKillsWidgetComponent', () => {
  let component: RoundKillsWidgetComponent;
  let fixture: ComponentFixture<RoundKillsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundKillsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundKillsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
