import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GHelpComponent } from './g-help.component';

describe('GHelpComponent', () => {
  let component: GHelpComponent;
  let fixture: ComponentFixture<GHelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GHelpComponent]
    });
    fixture = TestBed.createComponent(GHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
