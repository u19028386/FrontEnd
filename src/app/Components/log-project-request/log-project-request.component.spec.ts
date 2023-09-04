import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogProjectRequestComponent } from './log-project-request.component';

describe('LogProjectRequestComponent', () => {
  let component: LogProjectRequestComponent;
  let fixture: ComponentFixture<LogProjectRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogProjectRequestComponent]
    });
    fixture = TestBed.createComponent(LogProjectRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
