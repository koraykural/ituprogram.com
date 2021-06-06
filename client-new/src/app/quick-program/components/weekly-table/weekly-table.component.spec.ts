import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyTableComponent } from './weekly-table.component';

describe('WeeklyTableComponent', () => {
  let component: WeeklyTableComponent;
  let fixture: ComponentFixture<WeeklyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
