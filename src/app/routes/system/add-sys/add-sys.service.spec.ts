import { TestBed, inject } from '@angular/core/testing';

import { AddSysService } from './add-sys.service';

describe('AddSysService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddSysService]
    });
  });

  it('should ...', inject([AddSysService], (service: AddSysService) => {
    expect(service).toBeTruthy();
  }));
});
