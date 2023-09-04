import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClaimTypeComponent } from './edit-claim-type.component';

describe('EditClaimTypeComponent', () => {
  let component: EditClaimTypeComponent;
  let fixture: ComponentFixture<EditClaimTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditClaimTypeComponent]
    });
    fixture = TestBed.createComponent(EditClaimTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
