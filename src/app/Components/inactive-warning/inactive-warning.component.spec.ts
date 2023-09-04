import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveWarningComponent } from './inactive-warning.component';

describe('InactiveWarningComponent', () => {
  let component: InactiveWarningComponent;
  let fixture: ComponentFixture<InactiveWarningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InactiveWarningComponent]
    });
    fixture = TestBed.createComponent(InactiveWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
