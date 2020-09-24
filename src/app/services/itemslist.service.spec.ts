import { TestBed } from '@angular/core/testing';

import { ItemslistService } from './itemslist.service';

describe('ItemslistService', () => {
  let service: ItemslistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemslistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
