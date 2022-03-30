import { TestBed } from '@angular/core/testing';

import { Script.StoreService } from './script.store.service';

describe('Script.StoreService', () => {
  let service: Script.StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Script.StoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
