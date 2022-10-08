import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitehiresDashboardComponent } from './litehires-dashboard.component';

describe('LitehiresDashboardComponent', () => {
  let component: LitehiresDashboardComponent;
  let fixture: ComponentFixture<LitehiresDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LitehiresDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LitehiresDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
