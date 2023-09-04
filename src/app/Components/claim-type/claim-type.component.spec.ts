import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimTypeComponent } from './claim-type.component';

describe('ClaimTypeComponent', () => {
  let component: ClaimTypeComponent;
  let fixture: ComponentFixture<ClaimTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimTypeComponent]
    });
    fixture = TestBed.createComponent(ClaimTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
