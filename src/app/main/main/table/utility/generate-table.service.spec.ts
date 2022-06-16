import { TestBed } from '@angular/core/testing';

import { GenerateTableService } from './generate-table.service';

describe('GenerateTableService', () => {
  let service: GenerateTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
