import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsManagerComponent } from './operations-manager.component';

describe('OperationsManagerComponent', () => {
  let component: OperationsManagerComponent;
  let fixture: ComponentFixture<OperationsManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperationsManagerComponent]
    });
    fixture = TestBed.createComponent(OperationsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
