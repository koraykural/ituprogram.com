import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekTableComponent } from './week-table.component';

describe('WeekTableComponent', () => {
  let component: WeekTableComponent;
  let fixture: ComponentFixture<WeekTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
