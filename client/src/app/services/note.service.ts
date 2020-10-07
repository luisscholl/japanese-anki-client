import { Injectable } from '@angular/core';
import { Note } from '../models/note.model';
import { SettingsService } from './settings.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import * as Datastore from '../../../../nedb/browser-version/out/nedb.min';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  defaultNote: Note = {
    _id: undefined,
    japanese: undefined,
    japanesePronunciation: undefined,
    native: undefined,
    cardStatus: undefined,
    score: 0,
    lastReview: new Date(0),
    succeedOnLastReview: false,
    lastUpdate: undefined,
    update: 'create',
    tags: undefined
  };
  cardTypes = [
    'native-japanese-writing',
    'japanese-native-recall'
  ];
  db;

  constructor(
    private http: HttpClient,
    private settings: SettingsService
  ) { 
    this.db = new Datastore({ filename: 'notes.db', autoload: true });
    this.db.ensureIndex({ fieldName: 'japanese' }, err => {
      if (err) console.log(err);
    });
    this.db.ensureIndex({ fieldName: 'native' }, err => {
      if (err) console.log(err);
    });
    this.db.ensureIndex({ fieldName: 'japanesePronunciation' }, err => {
      if (err) console.log(err);
    });
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
    ): Promise<Note> {
      return this._newNote(Object.assign(this.defaultNote, 
        { 
          japanese: japanese, 
          native: native, 
          japanesePronunciation: japanesePronunciation,
          lastUpdate: new Date()
        }));
  }

  _newNote(note: Note): Promise<Note> {
    return new Promise((resolve, reject) => {
      this.db.insert(note, (err, newDoc) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(newDoc);
      });
    });
  }

  search(query: any = new RegExp('')): Promise<Note[]> {
    return new Promise((resolve, reject) => {
      this.db.find({
        $and: [
          query,
          { $not: { update: 'delete' }}
        ]
      }, (err, docs) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(docs);
      });
    });
  }

  delete(note: Note) {
    note.lastUpdate = new Date();
    note.update = 'delete';
    this.db.update({ _id: note._id }, note);
  }

  update(note: Note) {
    note.lastUpdate = new Date();
    note.update = 'update';
    this.db.update({ _id: note._id }, note);
  }
}
