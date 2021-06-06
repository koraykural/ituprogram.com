import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPoolComponent } from './class-pool.component';

describe('ClassPoolComponent', () => {
  let component: ClassPoolComponent;
  let fixture: ComponentFixture<ClassPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassPoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
