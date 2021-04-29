import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { NoteService } from 'src/app/services/note.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lj-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageComponent implements OnInit {

  faPlus = faPlus;

  _notes: Note[];
  newNote: Note;
  searchInput = '';
  lastSearchString = '';

  constructor(
    private notes: NoteService
  ) { }

  ngOnInit(): void {
    this.notes.search()
    .then(resolved => {
      this._notes = resolved;
    });
  }

  onSearchInput(e: InputEvent) {
    this.newNote = null;
    // To-Do:
    // * Document that the search takes Regex strings
    // * Evaluate whether it is good to take Regex strings
    //   * if applicable escape search string
    this.lastSearchString = (e.target as HTMLInputElement).value.trim();
    let query;
    try {
      query = new RegExp(this.lastSearchString, 'iu');
    } catch (err) {
      return;
    }
    this.notes.search(query).then(resolved => {
      this._notes = resolved;
    });
  }

  addNewCard() {
    this.newNote = null;
    this.notes.search('_New Note_')
    .then(resolved => {
      this.searchInput = '_New Note_';
      this.lastSearchString = '_New Note_';
      if (resolved.length > 0) {
        this._notes = null;
        this.newNote = resolved[0];
      } else {
        console.log('1');
        this.notes.newNote('_New Note_', '_New Note_')
        .then(resolved => {
          this._notes = [];
          this.newNote = resolved;
        })
      }
    })
  }

  resetSearch() {
    this.searchInput = '';
    this.newNote = null;
    this.notes.search().then(resolved => {
      this._notes = resolved;
    });
  }

  onNoteDeleted() {
    if (this.lastSearchString === '_New Note_') {
      this.searchInput = '';
    }
    this.notes.search().then(resolved => {
      this._notes = resolved;
    });
  }

}
