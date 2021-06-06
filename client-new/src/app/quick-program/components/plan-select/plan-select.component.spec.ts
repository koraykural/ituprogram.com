import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSelectComponent } from './plan-select.component';

describe('PlanSelectComponent', () => {
  let component: PlanSelectComponent;
  let fixture: ComponentFixture<PlanSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
