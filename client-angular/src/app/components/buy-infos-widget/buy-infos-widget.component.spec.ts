import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyInfosWidgetComponent } from './buy-infos-widget.component';

describe('BuyInfosWidgetComponent', () => {
  let component: BuyInfosWidgetComponent;
  let fixture: ComponentFixture<BuyInfosWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyInfosWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyInfosWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
