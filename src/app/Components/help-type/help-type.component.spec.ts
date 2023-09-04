import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpTypeComponent } from './help-type.component';

describe('HelpTypeComponent', () => {
  let component: HelpTypeComponent;
  let fixture: ComponentFixture<HelpTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpTypeComponent]
    });
    fixture = TestBed.createComponent(HelpTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
