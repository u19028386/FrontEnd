import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogItCallComponent } from './log-it-call.component';

describe('LogItCallComponent', () => {
  let component: LogItCallComponent;
  let fixture: ComponentFixture<LogItCallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogItCallComponent]
    });
    fixture = TestBed.createComponent(LogItCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
