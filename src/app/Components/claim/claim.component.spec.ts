import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimComponent } from './claim.component';

describe('ClaimComponent', () => {
  let component: ClaimComponent;
  let fixture: ComponentFixture<ClaimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimComponent]
    });
    fixture = TestBed.createComponent(ClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
