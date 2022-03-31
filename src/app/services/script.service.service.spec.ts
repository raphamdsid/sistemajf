import { TestBed } from '@angular/core/testing';

import { Script.ServiceService } from './script.service.service';

describe('Script.ServiceService', () => {
  let service: Script.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Script.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
