import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSelectComponent } from './class-select.component';

describe('ClassSelectComponent', () => {
  let component: ClassSelectComponent;
  let fixture: ComponentFixture<ClassSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
