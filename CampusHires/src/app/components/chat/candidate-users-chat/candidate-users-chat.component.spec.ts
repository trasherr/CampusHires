import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateUsersChatComponent } from './candidate-users-chat.component';

describe('CandidateUsersChatComponent', () => {
  let component: CandidateUsersChatComponent;
  let fixture: ComponentFixture<CandidateUsersChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateUsersChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateUsersChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
