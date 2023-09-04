import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaimTypeComponent } from './add-claim-type.component';

describe('AddClaimTypeComponent', () => {
  let component: AddClaimTypeComponent;
  let fixture: ComponentFixture<AddClaimTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddClaimTypeComponent]
    });
    fixture = TestBed.createComponent(AddClaimTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
