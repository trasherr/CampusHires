import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDropdownComponent } from './index-dropdown.component';

describe('IndexDropdownComponent', () => {
  let component: IndexDropdownComponent;
  let fixture: ComponentFixture<IndexDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
