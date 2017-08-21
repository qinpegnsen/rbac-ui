import { TestBed, inject } from '@angular/core/testing';

import { BindRoleService } from './bind-role.service';

describe('BindRoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BindRoleService]
    });
  });

  it('should ...', inject([BindRoleService], (service: BindRoleService) => {
    expect(service).toBeTruthy();
  }));
});
