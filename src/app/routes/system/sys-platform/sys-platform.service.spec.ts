import { TestBed, inject } from '@angular/core/testing';

import { SysPlatformService } from './sys-platform.service';

describe('SysPlatformService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SysPlatformService]
    });
  });

  it('should ...', inject([SysPlatformService], (service: SysPlatformService) => {
    expect(service).toBeTruthy();
  }));
});
