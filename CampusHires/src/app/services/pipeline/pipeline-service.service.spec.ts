import { TestBed } from '@angular/core/testing';

import { PipelineServiceService } from './pipeline-service.service';

describe('PipelineServideService', () => {
  let service: PipelineServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PipelineServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
