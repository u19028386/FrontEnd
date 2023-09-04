import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHelpTypeComponent } from './add-help-type.component';

describe('AddHelpTypeComponent', () => {
  let component: AddHelpTypeComponent;
  let fixture: ComponentFixture<AddHelpTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHelpTypeComponent]
    });
    fixture = TestBed.createComponent(AddHelpTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
