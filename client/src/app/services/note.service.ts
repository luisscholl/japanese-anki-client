import { Injectable } from "@angular/core";
import { CardStatus, Note } from "../models/note.model";
import { SettingsService } from "./settings.service";
import { HttpClient } from "@angular/common/http";
import { Observable, Subscription, throwError } from "rxjs";
import { Card } from "../models/card.model";
import { rejects } from "assert";
import { environment } from "src/environments/environment";
import { StatisticsService } from "./statistics.service";
import { TagService } from "./tag.service";
import { resolve } from "dns";
const PouchDB = require('pouchdb').default;
const pouchBulkDocs = PouchDB.prototype.bulkDocs;
import * as process from 'process';
window['process'] = process;
var that;
import * as PouchDBFind from 'pouchdb-find';
import { hexEncode } from '../utility';
import './parcelShim';
import Peer from "peerjs";
import { KeycloakService } from "keycloak-angular";
const MemoryStream = require('memorystream');
const replicationStream = require('pouchdb-replication-stream/dist/pouchdb.replication-stream.js');
const Buffer = require('buffer/').Buffer;
window['Buffer'] = Buffer;

@Injectable({
  providedIn: "root",
})
export class NoteService {
  defaultNote: Note = {
    _id: undefined,
    japanese: undefined,
    japanesePronunciation: undefined,
    native: undefined,
    cardStatus: [
      {
        type: 'new-card',
        lastIntervalInMillis: 0,
        lastReview: '-271821-04-21Z',
        scheduledReview: '-271821-04-21Z',
        stage: 'new',
        lapses: 0,
        ease: 0,
        reviews: 0
      }],
    tags: []
  };
  cardTypes = ["native-japanese-writing", "japanese-native-recall"];
  remoteDb;
  localDb;
  peer;
  peerConnections = {};
  sync;
  replicator;
  currentlyReviewed: {
    card: Card,
    note: Note;
  }
  queues: {
    new: { card: Card }[],
    learn: { card: Card }[],
    review: { card: Card }[],
    relearn: { card: Card }[]
  } = {
      new: [],
      learn: [],
      review: [],
      relearn: []
    }
  // values from settings service not initialized here as they could change during the existence of the note service
  initialLearnCardStatus: CardStatus[] =
    [{
      type: "native-japanese-writing",
      lastIntervalInMillis: 0,
      lastReview: '-271821-04-21Z',
      scheduledReview: '-271821-04-21Z',
      stage: 'learn',
      lapses: 0,
      ease: 0,
      reviews: 1
    }, {
      type: "japanese-native-recall",
      lastIntervalInMillis: 0,
      lastReview: '-271821-04-21Z',
      scheduledReview: '-271821-04-21Z',
      stage: 'learn',
      lapses: 0,
      ease: 0,
      reviews: 1
    }];
  initialReviewCardStatus = this.initialLearnCardStatus;
  sendBulkDocsToPeer = true;

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
    private statistics: StatisticsService,
    private tag: TagService,
    private keycloak: KeycloakService
  ) {
    that = this;
    PouchDB.plugin((PouchDBFind as any).default);
    PouchDB.plugin({ bulkDocs: this.sendBulkDocs });
    PouchDB.plugin(replicationStream.plugin);
    PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);
    this.localDb = new PouchDB('villosum_db', { auto_compaction: true });
    this.peer = new Peer({
      host: 'localhost',
      port: 4201,
      path: '/peerjs/myapp',
      secure: false,
      debug: 2,
      config: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      }
    });
    this.peer.on('open', id => {
      this.http.post(this.settings.getApiBaseUrl() + '/v1/peers', { id: id }).subscribe({
        next: response => {
          console.log('I am ' + id);
          for (let peerId of (response as any).peers) {
            if (peerId != this.peer.id) {
              this.peerConnections[peerId] = this.peer.connect(peerId);
              this.peerConnections[peerId].on('data', this.handleDataFromPeer);
              this.peerConnections[peerId].on('open', () => { this.sendReplicationDumpToRemote(this.peerConnections[peerId]); });
            }
          }
        }
      });
    });
    this.peer.on('connection', conn => {
      this.peerConnections[conn.peer] = conn;
      conn.on('data', this.handleDataFromPeer);
      conn.on('open', () => { this.sendReplicationDumpToRemote(conn); });
    });
    this.peer.on('error', err => {
      if (err.type === 'peer-unavailable') {
        let peerId = err.message.substr('Could not connect to peer '.length);
        delete this.peerConnections[peerId];
        this.http.delete(this.settings.getApiBaseUrl() + '/v1/peers/' + peerId).subscribe();
      } else {
        console.error(err);
      }
    })
    //this.settings.getDbChange().subscribe({
    //  next: ([user, apiBaseUrl]) => {
    //    if (this.sync) this.sync.cancel();
    //    this.remoteDb = new PouchDB(`${apiBaseUrl}/v1/db/${user}`);
    //    this.sync = this.localDb.sync(this.remoteDb, { live: true, retry: true }).on('error', console.error.bind(console));
    //  }
    //});
    this.localDb.createIndex({
      index: {
        fields: ['japanese', 'japanesePronunciation', 'native']
      }
    }).catch(err => {
      console.error(err);
    });
  }

  sendReplicationDumpToRemote(conn: any) {
    console.log('meow');
    let dumpedString = '';
    let stream = new MemoryStream();
    stream.on('data', chunk => {
      dumpedString += chunk.toString();
    });
    this.localDb.dump(stream).then(result => {
      conn.send({
        type: 'initialReplicationDump',
        dump: dumpedString
      });
    });
  }

  init() {

  }

  newNote(
    japanese: string,
    native: string,
    japanesePronunciation?: string
  ): Promise<Note> {
    return this._newNote(
      Object.assign(this.defaultNote, {
        _id: new Date().toJSON(),
        japanese: japanese,
        native: native,
        japanesePronunciation: japanesePronunciation,
        lastUpdate: new Date(),
      })
    );
  }

  _newNote(note: Note): Promise<Note> {
    if (note._rev) delete note._rev;
    return this.localDb.put(note).then(delta => {
      note._id = delta.id;
      note._rev = delta.rev;
      return note;
    }).catch(err => {
      console.error(err);
      throwError(err);
    });
  }

  search(query: any = new RegExp("")): Promise<Note[]> {
    return new Promise((resolve, reject) => {
      this.localDb.find(
        {
          selector:
          {
            $or: [
              { japanese: { $regex: query } },
              { japanesePronunciation: { $regex: query } },
              { native: { $regex: query } }
            ]
          }
        },
        (err, response) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(response.docs);
        }
      );
    });
  }

  delete(note: Note) {
    this.localDb.remove(note);
  }

  update(note: Note): Promise<Note> {
    return this.localDb.put(note)
      .then(result => {
        note._rev = result.rev;
        return note;
      })
      .catch(err => console.error(err));
  }

  async getNextCardOfStage(stage: "new" | "learn" | "review" | "relearn"): Promise<{ card: Card, note: Note }> {
    let now = new Date(Date.now() + environment.reviewLookAheadInMinutes * 60 * 1000).toJSON();
    return this.localDb.find({
      selector: {
        // sadly, PouchDB only supports simple selectors on $elemMatch
        //$and: [
        //  {
        //    cardStatus: {
        //      $elemMatch: {
        //        scheduledReview: {
        //          $gte: now
        //        }
        //      }
        //    }
        //  },
        //  {
        cardStatus: {
          $elemMatch: {
            stage: stage
          }
        }
        //  }
        //]
      }
    }).then(result => {
      let forReview: { card: Card, note: Note }[] = [];
      for (let note of result.docs) {
        for (let status of note.cardStatus) {
          if (status.scheduledReview < now) {
            forReview.push({
              card: Object.assign(status, {
                noteId: note._id,
                japanese: note.japanese,
                japanesePronunciation: note.japanesePronunciation,
                native: note.native,
                tags: (note.tags || []).concat(status.type)
              }),
              note: note
            });
          }
        }
      }
      forReview.sort((a, b) => Date.parse(a.card.scheduledReview) - Date.parse(b.card.scheduledReview))
      return forReview.length > 0 ? forReview[0] : null;
    }).catch(err => {
      console.error(err);
    });
  }

  async updateCardInDB(card: Card, note: Note): Promise<void> {
    card.scheduledReview = (new Date(Date.parse(card.scheduledReview) + Math.ceil(this.settings.getSchedulingDeviationInMillis() * (Math.random() * 2 - 1)))).toJSON();
    card.reviews++;
    let i = note.cardStatus.findIndex(status => status.type === card.type);
    note.cardStatus[i] = this.getCardStatusFromCard(card);
    return this.localDb.put(note).then(() => {
      return;
    }).catch(err => {
      console.error(err);
    });
  }

  // todo: potential to optimize speed by getting the first card of each stage in one swoop
  async updateCurrentlyReviewed(): Promise<{ card: Card, note: Note }> {
    for (let stage of ["relearn", "learn", "review", "new"]) {
      this.currentlyReviewed = await this.getNextCardOfStage(stage as any);
      if (this.currentlyReviewed) return this.currentlyReviewed;
    }
    return null;
  }

  async initReviewSessionAndGetFirstCard(): Promise<Card> {
    return this.updateCurrentlyReviewed().then(forReview => forReview && forReview.card);
  }

  async scheduleCurrentCardAndGetNext(quality: 'fail' | 'hard' | 'good' | 'easy'): Promise<Card> {
    let dbWriteStatus: Promise<void>;
    switch (this.currentlyReviewed.card.stage) {
      case "new":
        dbWriteStatus = this.scheduleCurrentCardNew();
        break;
      case "learn":
      case "relearn":
        dbWriteStatus = this.scheduleCurrentCardLearnRelearn(quality as 'fail' | 'good');
        break;
      case "review":
        dbWriteStatus = this.scheduleCurrentCardReview(quality);
        break;
    }
    return dbWriteStatus
      .then(() => {
        return this.updateCurrentlyReviewed().then(forReview => forReview && forReview.card);
      });
  }

  async scheduleCurrentCardNew(): Promise<void> {
    let status = this.initialLearnCardStatus;
    for (let i = 0; i < status.length; i++) {
      status[i].scheduledReview = new Date(
        Date.now() +
        this.settings.getLearningPhaseIntervalInMillis(0) +
        this.settings.getSchedulingDeviationInMillis() * (Math.random() * 2 - 1)
      ).toJSON();
      status[i].lastIntervalInMillis = this.settings.getLearningPhaseIntervalInMillis(0);
    }
    this.currentlyReviewed.note.cardStatus = status;
    return this.localDb.put(this.currentlyReviewed.note)
      .then(response => {
        return;
      })
      .catch(err => {
        console.error(err);
      });
  }

  async scheduleCurrentCardLearnRelearn(succeeded: 'fail' | 'good'): Promise<void> {
    switch (succeeded) {
      case 'fail':
        this.currentlyReviewed.card.ease = 0;
        break;

      case 'good':
        this.currentlyReviewed.card.ease++;
        break;
    }
    let interval: number;
    if (this.currentlyReviewed.card.stage === 'learn') {
      interval = this.settings.getLearningPhaseIntervalInMillis(this.currentlyReviewed.card.ease);
    } else {
      interval = this.settings.getRelearningPhaseIntervalInMillis(this.currentlyReviewed.card.ease);
    }
    this.currentlyReviewed.card.lastReview = new Date().toJSON();
    if (interval === -1) {
      // promote card
      if (this.currentlyReviewed.card.stage === 'learn') {
        this.currentlyReviewed.card.ease = this.settings.getGraduatingEase();
        this.currentlyReviewed.card.lastIntervalInMillis = this.settings.getGraduatingIntervalInMillis() * this.statistics.getGlobalIntervalModifier() * this.tag.getProductOfTagEases(this.currentlyReviewed.card);
        interval = this.currentlyReviewed.card.lastIntervalInMillis;
      } else {
        this.currentlyReviewed.card.lastIntervalInMillis = Math.max(this.settings.getMinRelearnPassedIntervalInMillis(), this.currentlyReviewed.card.lastIntervalInMillis * this.settings.getRelearnPassedIntervalModifier());
      }
      this.currentlyReviewed.card.stage = "review";
    }
    if (this.currentlyReviewed.card.stage === 'learn' || this.currentlyReviewed.card.stage === 'relearn') {
      this.currentlyReviewed.card.scheduledReview = new Date(Date.now() + interval).toJSON();
    } else {
      this.currentlyReviewed.card.scheduledReview = new Date(Date.now() + this.currentlyReviewed.card.lastIntervalInMillis).toJSON();
    }
    return this.updateCardInDB(this.currentlyReviewed.card, this.currentlyReviewed.note);
  }

  async scheduleCurrentCardReview(quality: 'fail' | 'hard' | 'good' | 'easy'): Promise<void> {
    switch (quality) {
      case 'fail':
        this.currentlyReviewed.card.stage = "relearn";
        this.currentlyReviewed.card.ease = Math.max(this.settings.getMinEase(), this.currentlyReviewed.card.ease + this.settings.getFailEaseModifier());
        this.currentlyReviewed.card.lapses++;
        this.currentlyReviewed.card.scheduledReview = new Date(Date.now() + this.settings.getRelearningPhaseIntervalInMillis(0)).toJSON();
        this.updateCardInDB(this.currentlyReviewed.card, this.currentlyReviewed.note);
        return;

      case 'hard':
        this.currentlyReviewed.card.lastIntervalInMillis *= 1.2 * this.statistics.getGlobalIntervalModifier() * this.tag.getProductOfTagEases(this.currentlyReviewed.card);
        this.currentlyReviewed.card.ease = Math.max(this.settings.getMinEase(), this.currentlyReviewed.card.ease + this.settings.getHardEaseModifier());
        break;

      case 'good':
        this.currentlyReviewed.card.lastIntervalInMillis *= this.currentlyReviewed.card.ease * this.statistics.getGlobalIntervalModifier() * this.tag.getProductOfTagEases(this.currentlyReviewed.card);
        this.currentlyReviewed.card.ease = Math.max(this.settings.getMinEase(), this.currentlyReviewed.card.ease + this.settings.getGoodEaseModifier());
        break;

      case 'easy':
        this.currentlyReviewed.card.lastIntervalInMillis *= this.currentlyReviewed.card.ease * this.statistics.getGlobalIntervalModifier() * this.tag.getProductOfTagEases(this.currentlyReviewed.card) * this.settings.getEasyBonus();
        this.currentlyReviewed.card.ease = Math.max(this.settings.getMinEase(), this.currentlyReviewed.card.ease + this.settings.getEasyEaseModifier());
        break;
    }
    this.currentlyReviewed.card.scheduledReview = new Date(Date.now() + this.currentlyReviewed.card.lastIntervalInMillis).toJSON();
    return this.updateCardInDB(this.currentlyReviewed.card, this.currentlyReviewed.note);
  }

  getCardStatusFromCard(card: Card): CardStatus {
    return {
      type: card.type,
      lastIntervalInMillis: card.lastIntervalInMillis,
      lastReview: card.lastReview,
      scheduledReview: card.scheduledReview,
      stage: card.stage,
      lapses: card.lapses,
      ease: card.ease,
      reviews: card.reviews
    };
  }

  sendBulkDocs(docs, options, callback) {
    console.log('I am battoman.');
    console.log(docs);
    console.log(options);
    console.log(callback);
    if (that.sendBulkDocsToPeer) {
      console.log('Sending bulk docs.');
      // todo: Revisit whether it wouldn't be smarter to have peerConnections as an array
      for (const [peerId, conn] of Object.entries(that.peerConnections)) {
        (conn as any).send({
          type: 'bulkDocs',
          origin: peerId,
          docs: docs,
          options: options
        });
      }
    }
    if (!callback) return pouchBulkDocs.call(this, docs, options);
    return pouchBulkDocs.call(this, docs, options, callback);
  }

  // Might need some work as I currently don't understand, why handleDataFromPeer seems to be called with a { type: 'bulkDocs' } object with the data of the initial replication dump
  // Maybe something between sendBulkDocs = false and sendBulkDocs = true is async? (Can't pass this trivially as an argument instead of global state as bulkDocs is called from replicate.to.)
  handleDataFromPeer(data: { type: 'bulkDocs', origin: string, docs: any, options: any } | { type: 'initialReplicationDump', dump: string }) {
    that.sendBulkDocsToPeer = false;
    console.log('nyaaa');
    console.log(data);
    if (data.type === 'bulkDocs') {
      if (origin == this.peer.id) return;
      that.localDb.bulkDocs(data.docs, data.options, () => 'I am callback.');
    } else if (data.type === 'initialReplicationDump') {
      let stream = new MemoryStream([data.dump]);
      let remoteDb = new PouchDB('remoteDb');
      remoteDb.load(stream);
      remoteDb.replicate.to(that.localDb);
    }
    console.log('aaayn');
    that.sendBulkDocsToPeer = true;
  }
}
