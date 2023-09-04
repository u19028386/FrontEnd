import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCalendarComponent } from './edit-calendar.component';

describe('EditCalendarComponent', () => {
  let component: EditCalendarComponent;
  let fixture: ComponentFixture<EditCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCalendarComponent]
    });
    fixture = TestBed.createComponent(EditCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
