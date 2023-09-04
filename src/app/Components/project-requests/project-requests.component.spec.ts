import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRequestsComponent } from './project-requests.component';

describe('ProjectRequestsComponent', () => {
  let component: ProjectRequestsComponent;
  let fixture: ComponentFixture<ProjectRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectRequestsComponent]
    });
    fixture = TestBed.createComponent(ProjectRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
