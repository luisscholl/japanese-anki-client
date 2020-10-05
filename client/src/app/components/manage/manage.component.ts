import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'lj-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  value: string = 'Enter something';

  constructor(
    private notes: NoteService
  ) { }

  ngOnInit(): void {
  }

  updateValue(e: InputEvent) {
    this.value = e.data;
  }

  add() {
    this.notes.newNote(this.value, this.value);
  }

}
