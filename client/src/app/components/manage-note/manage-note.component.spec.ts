import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNoteComponent } from './manage-note.component';

describe('ManageNoteComponent', () => {
  let component: ManageNoteComponent;
  let fixture: ComponentFixture<ManageNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
