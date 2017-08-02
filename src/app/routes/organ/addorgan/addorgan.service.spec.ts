import { TestBed, inject } from '@angular/core/testing';

import { AddorganService } from './addorgan.service';

describe('AddorganService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddorganService]
    });
  });

  it('should ...', inject([AddorganService], (service: AddorganService) => {
    expect(service).toBeTruthy();
  }));
});
