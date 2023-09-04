import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamHoursReportComponent } from './team-hours-report.component';

describe('TeamHoursReportComponent', () => {
  let component: TeamHoursReportComponent;
  let fixture: ComponentFixture<TeamHoursReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamHoursReportComponent]
    });
    fixture = TestBed.createComponent(TeamHoursReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
