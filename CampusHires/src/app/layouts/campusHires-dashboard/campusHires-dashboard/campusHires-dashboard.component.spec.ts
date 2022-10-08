import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusHiresDashboardComponent } from './campusHires-dashboard.component';

describe('CampusHiresDashboardComponent', () => {
  let component: CampusHiresDashboardComponent;
  let fixture: ComponentFixture<CampusHiresDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampusHiresDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusHiresDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
