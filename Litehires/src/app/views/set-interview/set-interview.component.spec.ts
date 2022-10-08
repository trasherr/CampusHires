import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetInterviewComponent } from './set-interview.component';

describe('SetInterviewComponent', () => {
  let component: SetInterviewComponent;
  let fixture: ComponentFixture<SetInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetInterviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
