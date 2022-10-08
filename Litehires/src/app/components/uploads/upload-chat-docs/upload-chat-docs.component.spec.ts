import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadChatDocsComponent } from './upload-chat-docs.component';

describe('UploadChatDocsComponent', () => {
  let component: UploadChatDocsComponent;
  let fixture: ComponentFixture<UploadChatDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadChatDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadChatDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
