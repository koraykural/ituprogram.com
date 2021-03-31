import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentSelectorComponent } from './department-selector.component';

describe('DepartmentSelectorComponent', () => {
  let component: DepartmentSelectorComponent;
  let fixture: ComponentFixture<DepartmentSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
