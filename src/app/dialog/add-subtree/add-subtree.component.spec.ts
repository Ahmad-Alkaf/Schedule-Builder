import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubtreeComponent } from './add-subtree.component';

describe('AddSubtreeComponent', () => {
  let component: AddSubtreeComponent;
  let fixture: ComponentFixture<AddSubtreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubtreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubtreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
