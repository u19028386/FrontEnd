import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponentComponent } from './notification-component.component';

describe('NotificationComponentComponent', () => {
  let component: NotificationComponentComponent;
  let fixture: ComponentFixture<NotificationComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponentComponent]
    });
    fixture = TestBed.createComponent(NotificationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
