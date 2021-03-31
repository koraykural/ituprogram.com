import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptGroupComponent } from './opt-group.component';

describe('OptGroupComponent', () => {
  let component: OptGroupComponent;
  let fixture: ComponentFixture<OptGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
