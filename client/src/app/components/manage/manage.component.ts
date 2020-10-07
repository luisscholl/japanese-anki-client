import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { NoteService } from 'src/app/services/note.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lj-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  faPlus = faPlus;

  _notes: Note[];
  newNote: Note;
  searchInput = '';

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
    const searchString = (e.target as HTMLInputElement).value.trim();
    let query;
    try {
      query = new RegExp(searchString, 'iu');
    } catch (err) {
      return;
    }
    this.notes.search({
      $or: [
        { japanese: query },
        { native: query },
        { japanesePronunciation: query }
    ]}).then(resolved => {
      this._notes = resolved;
    });
  }

  addNewCard() {
    this.newNote = null;
    this.notes.search({
      $or: [
        { japanese: /_New Note_/ },
        { native: /_New Note_/ },
        { japanesePronunciation: /_New Note_/ }
    ]})
    .then(resolved => {
      this.searchInput = '_New Note_';
      if (resolved.length > 0) {
        this._notes = null;
        this.newNote = resolved[0];
      } else {
        this.notes.newNote('_New Note_', '_New Note_')
        .then(resolved => {
          this._notes = [];
          this.newNote = resolved;
        })
      }
    })
  }

}
