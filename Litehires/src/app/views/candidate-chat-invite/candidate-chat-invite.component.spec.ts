import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateChatInviteComponent } from './candidate-chat-invite.component';

describe('CandidateChatInviteComponent', () => {
  let component: CandidateChatInviteComponent;
  let fixture: ComponentFixture<CandidateChatInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateChatInviteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateChatInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
