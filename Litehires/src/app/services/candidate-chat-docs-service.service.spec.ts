import { TestBed } from '@angular/core/testing';

import { CandidateChatDocsServiceService } from './candidate-chat-docs-service.service';

describe('CandidateChatDocsServiceService', () => {
  let service: CandidateChatDocsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateChatDocsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
