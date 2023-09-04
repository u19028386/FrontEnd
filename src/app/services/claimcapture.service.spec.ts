import { TestBed } from '@angular/core/testing';

import { ClaimcaptureService } from './claimcapture.service';

describe('ClaimcaptureService', () => {
  let service: ClaimcaptureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimcaptureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
