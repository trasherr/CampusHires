import { TestBed } from '@angular/core/testing';

import { ChatDocsServiceService } from './chat-docs-service.service';

describe('ChatDocsServiceService', () => {
  let service: ChatDocsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatDocsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
