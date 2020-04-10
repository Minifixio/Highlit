import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchInfosComponent } from './match-infos.component';

describe('MatchInfosComponent', () => {
  let component: MatchInfosComponent;
  let fixture: ComponentFixture<MatchInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchInfosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
