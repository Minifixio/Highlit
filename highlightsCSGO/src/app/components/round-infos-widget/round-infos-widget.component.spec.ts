import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundInfosWidgetComponent } from './round-infos-widget.component';

describe('RoundInfosWidgetComponent', () => {
  let component: RoundInfosWidgetComponent;
  let fixture: ComponentFixture<RoundInfosWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundInfosWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundInfosWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
