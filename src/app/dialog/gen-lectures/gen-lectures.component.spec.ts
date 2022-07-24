import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenLecturesComponent } from './gen-lectures.component';

describe('GenLecturesComponent', () => {
  let component: GenLecturesComponent;
  let fixture: ComponentFixture<GenLecturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenLecturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenLecturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
