import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanGroupTableComponent } from './plan-group-table.component';

describe('PlanGroupTableComponent', () => {
  let component: PlanGroupTableComponent;
  let fixture: ComponentFixture<PlanGroupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanGroupTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
