import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddedMembersComponent } from './edit-added-members.component';

describe('EditAddedMembersComponent', () => {
  let component: EditAddedMembersComponent;
  let fixture: ComponentFixture<EditAddedMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAddedMembersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAddedMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
