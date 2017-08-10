import { TestBed, inject } from '@angular/core/testing';

import { LimttabService } from './limttab.service';

describe('LimttabService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LimttabService]
    });
  });

  it('should ...', inject([LimttabService], (service: LimttabService) => {
    expect(service).toBeTruthy();
  }));
});
