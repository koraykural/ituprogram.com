import { TestBed } from '@angular/core/testing';

import { ClassDataService } from './class-data.service';

describe('ClassDataService', () => {
  let service: ClassDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
