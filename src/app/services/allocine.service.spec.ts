import { TestBed } from '@angular/core/testing';

import { AllocineService } from './allocine.service';

describe('AllocineService', () => {
  let service: AllocineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllocineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
