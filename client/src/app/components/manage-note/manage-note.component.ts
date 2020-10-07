import { Component, Input, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'lj-manage-note',
  templateUrl: './manage-note.component.html',
  styleUrls: ['./manage-note.component.scss']
})
export class ManageNoteComponent implements OnInit {

  faTimes = faTimes;
  faTrash = faTrash;

  collapsed = true;
  deleted = false;

  constructor(
    private notes: NoteService
  ) { }

  @Input() note: Note;
  @Input() startInEditMode: boolean = false;

  ngOnInit(): void {
    if(this.startInEditMode) this.collapsed = false;
  }

  expand() {
    this.collapsed = false;
  }

  collapse() {
    this.collapsed = true;
  }

  delete() {
    this.notes.delete(this.note);
    this.deleted = true;
  }

  updateJapanese(e: InputEvent) {
    this.note.japanese = (e.target as HTMLInputElement).value.trim();
    this.notes.update(this.note);
  }

  updateJapanesePronunciation(e: InputEvent) {
    this.note.japanesePronunciation = (e.target as HTMLInputElement).value.trim();
    this.notes.update(this.note);
  }

  updateNative(e: InputEvent) {
    this.note.native = (e.target as HTMLInputElement).value.trim();
    this.notes.update(this.note);
  }

}
