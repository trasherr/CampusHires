import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateChatComponent } from './candidate-chat.component';

describe('CandidateChatComponent', () => {
  let component: CandidateChatComponent;
  let fixture: ComponentFixture<CandidateChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
