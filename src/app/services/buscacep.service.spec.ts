import { TestBed } from '@angular/core/testing';

import { BuscacepService } from './buscacep.service';

describe('BuscacepService', () => {
  let service: BuscacepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscacepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
