import { Injectable } from '@angular/core';
import { Note } from '../models/note.model';
import { SettingsService } from './settings.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const Datastore = require('nedb-promises');

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  defaultNote: Note = {
    id: null,
    japanese: null,
    japanesePronunciation: null,
    native: null,
    cardStatus: null,
    score: 0,
    lastReview: new Date(0),
    succeedOnLastReview: false,
    lastUpdate: null,
    update: 'create'
  };
  cardTypes = [
    'native-japanese-writing',
    'japanese-native-recall'
  ];
  datastore;

  constructor(
    private http: HttpClient,
    private settings: SettingsService
  ) { 
    this.datastore = Datastore.create('notes.db');
    let cardStatus = new Map();
    for (let cardType of this.cardTypes) {
      cardStatus.set(cardType, {
        score: 0,
        lastReview: new Date(0),
        succeededOnLastReview: false
      })
    }
    this.defaultNote.cardStatus = cardStatus;
  }

  newNote(
    japanese: string,
    native: string,
    japanesePronunciation?: string,
    ): void {
      this._newNote(Object.assign(this.defaultNote, 
        { 
          japanese: japanese, 
          native: native, 
          japanesePronunciation: japanesePronunciation,
          lastUpdate: new Date()
        }));
  }

  _newNote(note: Note) {
    this.datastore.insert(note).then(() => {
      return this.datastore.find();
    });
  }
}
