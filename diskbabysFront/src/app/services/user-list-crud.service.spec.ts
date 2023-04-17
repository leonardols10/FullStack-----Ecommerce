import { TestBed } from '@angular/core/testing';

import { UserListCrudService } from './user-list-crud.service';

describe('UserListCrudService', () => {
  let service: UserListCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserListCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
