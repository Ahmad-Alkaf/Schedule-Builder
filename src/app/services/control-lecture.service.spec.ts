import { TestBed } from '@angular/core/testing';

import { ControlLectureService } from './control-lecture.service';

describe('ControlLectureService', () => {
  let service: ControlLectureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlLectureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
