import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOtpComponent } from './read-otp.component';

describe('ReadOtpComponent', () => {
  let component: ReadOtpComponent;
  let fixture: ComponentFixture<ReadOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadOtpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
