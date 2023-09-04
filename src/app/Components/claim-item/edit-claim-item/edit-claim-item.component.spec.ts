import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClaimItemComponent } from './edit-claim-item.component';

describe('EditClaimItemComponent', () => {
  let component: EditClaimItemComponent;
  let fixture: ComponentFixture<EditClaimItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditClaimItemComponent]
    });
    fixture = TestBed.createComponent(EditClaimItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
