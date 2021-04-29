import { Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'lj-manage-note',
  templateUrl: './manage-note.component.html',
  styleUrls: ['./manage-note.component.scss'],
  encapsulation: ViewEncapsulation.None
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

  @Output() collapse: EventEmitter<null> = new EventEmitter();
  @Output() delete: EventEmitter<null> = new EventEmitter();

  ngOnInit(): void {
    if(this.startInEditMode) this.collapsed = false;
  }

  expand() {
    this.collapsed = false;
  }

  _collapse() {
    this.collapsed = true;
    this.collapse.emit();
  }

  _delete() {
    this.notes.delete(this.note);
    this.deleted = true;
    this.delete.emit();
  }

  async updateJapanese(e: InputEvent) {
    this.note.japanese = (e.target as HTMLInputElement).value.trim();
    this.note = await this.notes.update(this.note);
  }

  async updateJapanesePronunciation(e: InputEvent) {
    this.note.japanesePronunciation = (e.target as HTMLInputElement).value.trim();
    this.note = await this.notes.update(this.note);
  }

  async updateNative(e: InputEvent) {
    this.note.native = (e.target as HTMLInputElement).value.trim();
    this.note = await this.notes.update(this.note);
  }

}
