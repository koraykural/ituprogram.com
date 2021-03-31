import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CannotCreateComponent } from './cannot-create.component';

describe('CannotCreateComponent', () => {
  let component: CannotCreateComponent;
  let fixture: ComponentFixture<CannotCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CannotCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CannotCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
