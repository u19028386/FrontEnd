import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimCaptureComponent } from './claim-capture.component';

describe('ClaimCaptureComponent', () => {
  let component: ClaimCaptureComponent;
  let fixture: ComponentFixture<ClaimCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimCaptureComponent]
    });
    fixture = TestBed.createComponent(ClaimCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
