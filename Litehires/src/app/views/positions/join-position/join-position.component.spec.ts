import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinPositionComponent } from './join-position.component';

describe('JoinPositionComponent', () => {
  let component: JoinPositionComponent;
  let fixture: ComponentFixture<JoinPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinPositionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
