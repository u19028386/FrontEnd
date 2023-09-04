import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHelpTypeComponent } from './edit-help-type.component';

describe('EditHelpTypeComponent', () => {
  let component: EditHelpTypeComponent;
  let fixture: ComponentFixture<EditHelpTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditHelpTypeComponent]
    });
    fixture = TestBed.createComponent(EditHelpTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
