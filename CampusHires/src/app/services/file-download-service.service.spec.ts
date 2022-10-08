import { TestBed } from '@angular/core/testing';

import { FileDownloadServiceService } from './file-download-service.service';

describe('FileDownloadServiceService', () => {
  let service: FileDownloadServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileDownloadServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
