import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetApprovalComponent } from './time-sheet-approval.component';

describe('TimeSheetApprovalComponent', () => {
  let component: TimeSheetApprovalComponent;
  let fixture: ComponentFixture<TimeSheetApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSheetApprovalComponent]
    });
    fixture = TestBed.createComponent(TimeSheetApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
