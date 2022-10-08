import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChartsComponent } from './user-charts.component';

describe('UserChartsComponent', () => {
  let component: UserChartsComponent;
  let fixture: ComponentFixture<UserChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
