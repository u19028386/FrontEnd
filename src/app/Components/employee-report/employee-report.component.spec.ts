import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReportComponent } from './employee-report.component';

describe('EmployeeReportComponent', () => {
  let component: EmployeeReportComponent;
  let fixture: ComponentFixture<EmployeeReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeReportComponent]
    });
    fixture = TestBed.createComponent(EmployeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
