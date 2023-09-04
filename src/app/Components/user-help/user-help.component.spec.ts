import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHelpComponent } from './user-help.component';

describe('UserHelpComponent', () => {
  let component: UserHelpComponent;
  let fixture: ComponentFixture<UserHelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserHelpComponent]
    });
    fixture = TestBed.createComponent(UserHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
