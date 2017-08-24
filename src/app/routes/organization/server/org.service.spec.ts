import { TestBed, inject } from '@angular/core/testing';

import { OrgService } from './org.service';

describe('OrgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgService]
    });
  });

  it('should ...', inject([OrgService], (service: OrgService) => {
    expect(service).toBeTruthy();
  }));
});
