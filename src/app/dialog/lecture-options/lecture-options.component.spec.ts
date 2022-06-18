import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureOptionsComponent } from './lecture-options.component';

describe('LectureOptionsComponent', () => {
  let component: LectureOptionsComponent;
  let fixture: ComponentFixture<LectureOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LectureOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LectureOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
