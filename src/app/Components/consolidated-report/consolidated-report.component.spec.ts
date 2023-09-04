import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedReportComponent } from './consolidated-report.component';

describe('ConsolidatedReportComponent', () => {
  let component: ConsolidatedReportComponent;
  let fixture: ComponentFixture<ConsolidatedReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsolidatedReportComponent]
    });
    fixture = TestBed.createComponent(ConsolidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
