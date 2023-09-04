import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaimItemComponent } from './add-claim-item.component';

describe('AddClaimItemComponent', () => {
  let component: AddClaimItemComponent;
  let fixture: ComponentFixture<AddClaimItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddClaimItemComponent]
    });
    fixture = TestBed.createComponent(AddClaimItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
