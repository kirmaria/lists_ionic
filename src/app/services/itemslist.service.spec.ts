import { TestBed } from '@angular/core/testing';

import { ItemsListService } from './itemslist.service';

describe('ItemslistService', () => {
  let service: ItemsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
