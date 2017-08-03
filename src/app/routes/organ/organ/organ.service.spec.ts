import { TestBed, inject } from '@angular/core/testing';

import { OrganService } from './organ.service';

describe('OrganService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganService]
    });
  });

  it('should ...', inject([OrganService], (service: OrganService) => {
    expect(service).toBeTruthy();
  }));
});
