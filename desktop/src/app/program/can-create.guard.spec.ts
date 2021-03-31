import { TestBed } from '@angular/core/testing';

import { CanCreateGuard } from './can-create.guard';

describe('CanCreateGuard', () => {
  let guard: CanCreateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanCreateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
