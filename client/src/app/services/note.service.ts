import { Injectable } from "@angular/core";
import { CardStatus, Note } from "../models/note.model";
import { SettingsService } from "./settings.service";
import { HttpClient } from "@angular/common/http";
import { Observable, Subscription } from "rxjs";
import * as Datastore from "../../../../nedb/browser-version/out/nedb.min";
import { Card } from "../models/card.model";
import { rejects } from "assert";
import { environment } from "src/environments/environment";
import { not } from "@angular/compiler/src/output/output_ast";
import { StatisticsService } from "./statistics.service";
import { TagService } from "./tag.service";
import { resolve } from "dns";

@Injectable({
  providedIn: "root",
})
export class NoteService {
  defaultNote: Note = {
    _id: undefined,
    japanese: undefined,
    japanesePronunciation: undefined,
    native: undefined,
    cardStatus: {
      "new-card": {
        lastIntervalInMillis: 0,
        lastReview: new Date(0),
        scheduledReview: new Date(0),
        stage: 'new',
        lapses: 0,
        ease: 0,
        reviews: 0
      },
    },
    lastUpdate: undefined,
    update: "create",
    tags: []
  };
  cardTypes = ["native-japanese-writing", "japanese-native-recall"];
  db;
  currentlyReviewed: {
    card: Card,
    noteId: string;
  }
  queues: {
    new: { card: Card, noteId: string }[],
    learn: { card: Card, noteId: string }[],
    review: { card: Card, noteId: string }[],
    relearn: { card: Card, noteId: string }[]
  } = {
      new: [],
      learn: [],
      review: [],
      relearn: []
    }
  // values from settings service not initialized here as they could change during the existence of the note service
  initialLearnCardStatus: {
    "native-japanese-writing": CardStatus;
    "japanese-native-recall": CardStatus;
  } = {
      "native-japanese-writing": {
        lastIntervalInMillis: 0,
        lastReview: new Date(0),
        scheduledReview: new Date(0),
        stage: 'learn',
        lapses: 0,
        ease: 0,
        reviews: 1
      },
      "japanese-native-recall": {
        lastIntervalInMillis: 0,
        lastReview: new Date(0),
        scheduledReview: new Date(0),
        stage: 'learn',
        lapses: 0,
        ease: 0,
        reviews: 1
      },
    };
  initialReviewCardStatus: {
    "native-japanese-writing": CardStatus;
    "japanese-native-recall": CardStatus;
  } = {
      "native-japanese-writing": {
        lastIntervalInMillis: 0,
        lastReview: new Date(0),
        scheduledReview: new Date(0),
        stage: 'review',
        lapses: 0,
        ease: 0,
        reviews: 0
      },
      "japanese-native-recall": {
        lastIntervalInMillis: 0,
        lastReview: new Date(0),
        scheduledReview: new Date(0),
        stage: 'review',
        lapses: 0,
        ease: 0,
        reviews: 0
      },
    };

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
    private statistics: StatisticsService,
    private tag: TagService
  ) {
    this.db = new Datastore({ filename: "notes.db", autoload: true });
    this.db.ensureIndex({ fieldName: "japanese" }, (err) => {
      if (err) console.log(err);
    });
    this.db.ensureIndex({ fieldName: "native" }, (err) => {
      if (err) console.log(err);
    });
    this.db.ensureIndex({ fieldName: "japanesePronunciation" }, (err) => {
      if (err) console.log(err);
    });
  }

  newNote(
    japanese: string,
    native: string,
    japanesePronunciation?: string
  ): Promise<Note> {
    return this._newNote(
      Object.assign(this.defaultNote, {
        japanese: japanese,
        native: native,
        japanesePronunciation: japanesePronunciation,
        lastUpdate: new Date(),
      })
    );
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

  search(query: any = new RegExp("")): Promise<Note[]> {
    return new Promise((resolve, reject) => {
      this.db.find(
        {
          $and: [query, { $not: { update: "delete" } }],
        },
        (err, docs) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(docs);
        }
      );
    });
  }

  delete(note: Note) {
    note.lastUpdate = new Date();
    note.update = "delete";
    this.db.update({ _id: note._id }, note);
  }

  update(note: Note) {
    note.lastUpdate = new Date();
    note.update = "update";
    this.db.update({ _id: note._id }, note);
  }

  async getNextCardOfStage(stage: "new" | "learn" | "review" | "relearn"): Promise<{ card: Card, noteId: string }> {
    return new Promise((resolve, reject) => {
      let now = new Date(Date.now() + environment.reviewLookAheadInMinutes * 60 * 1000);
      this.db.find(
        {
          $where: function () {
            if (this.update === 'delete') return false;
            for (let cardStatus of Object.values(
              this.cardStatus
            ) as CardStatus[]) {
              if (cardStatus.scheduledReview <= now && cardStatus.stage === stage) return true;
            }
            return false;
          },
        },
        (err, notes: Note[]) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            let forReview: { card: Card, noteId: string }[] = [];
            for (let note of notes) {
              for (let cardStatus of Object.entries(note.cardStatus)) {
                if (cardStatus[1].scheduledReview <= now) {
                  forReview.push({
                    card: {
                      type: cardStatus[0] as any,
                      japanese: note.japanese,
                      japanesePronunciation: note.japanesePronunciation,
                      native: note.native,
                      stage: cardStatus[1].stage,
                      lapses: cardStatus[1].lapses,
                      ease: cardStatus[1].ease,
                      reviews: cardStatus[1].reviews,
                      lastIntervalInMillis: cardStatus[1].lastIntervalInMillis,
                      lastReview: cardStatus[1].lastReview,
                      scheduledReview: cardStatus[1].scheduledReview,
                      tags: (note.tags || []).concat(cardStatus[0])
                    },
                    noteId: note._id,
                  });
                }
              }
            }
            forReview = forReview.sort(
              (a, b) => a.card.scheduledReview.getTime() - b.card.scheduledReview.getTime()
            );
            resolve((forReview.length > 0 && forReview[0].card.scheduledReview <= new Date(Date.now())) ? forReview[0] : null);
          }
        }
      );
    });
  }

  async updateCardInDB(card: Card, noteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      card.scheduledReview = new Date(card.scheduledReview.getTime() + Math.ceil(this.settings.getSchedulingDeviationInMillis() * (Math.random() * 2 - 1)));
      card.reviews++;
      this.db.update(
        { _id: noteId },
        { $set: { [`cardStatus.${card.type}`]: this.getCardStatusFromCard(card) } },
        (err) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve();
        }
      );
    });
  }

  async updateCurrentlyReviewed(): Promise<{ card: Card, noteId: string }> {
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
    let DBWriteStatus: Promise<void>;
    switch (this.currentlyReviewed.card.stage) {
      case "new":
        DBWriteStatus = this.scheduleCurrentCardNew();
        break;
      case "learn":
      case "relearn":
        DBWriteStatus = this.scheduleCurrentCardLearnRelearn(quality as 'fail' | 'good');
        break;
      case "review":
        DBWriteStatus = this.scheduleCurrentCardReview(quality);
        break;
    }
    return DBWriteStatus
      .then(() => {
        return this.updateCurrentlyReviewed().then(forReview => forReview && forReview.card);
      });
  }

  async scheduleCurrentCardNew(): Promise<void> {
    return new Promise((resolve, reject) => {
      let initialLearnCardStatus = this.initialLearnCardStatus;
      for (let type of ["japanese-native-recall", "native-japanese-writing"]) {
        initialLearnCardStatus[type].scheduledReview = new Date(
          Date.now() +
          this.settings.getLearningPhaseIntervalInMillis(0) +
          this.settings.getSchedulingDeviationInMillis() * (Math.random() * 2 - 1)
        );
        initialLearnCardStatus[type].lastIntervalInMillis = this.settings.getLearningPhaseIntervalInMillis(0);
      }
      this.db.update(
        { _id: this.currentlyReviewed.noteId },
        {
          $set: {
            cardStatus: initialLearnCardStatus,
            update: "review",
            stage: "learn"
          }
        },
        err => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        }
      );
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
    this.currentlyReviewed.card.lastReview = new Date();
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
      this.currentlyReviewed.card.scheduledReview = new Date(Date.now() + interval);
    } else {
      this.currentlyReviewed.card.scheduledReview = new Date(Date.now() + this.currentlyReviewed.card.lastIntervalInMillis);
    }
    return this.updateCardInDB(this.currentlyReviewed.card, this.currentlyReviewed.noteId);
  }

  async scheduleCurrentCardReview(quality: 'fail' | 'hard' | 'good' | 'easy'): Promise<void> {
    switch (quality) {
      case 'fail':
        this.currentlyReviewed.card.stage = "relearn";
        this.currentlyReviewed.card.ease = Math.max(this.settings.getMinEase(), this.currentlyReviewed.card.ease + this.settings.getFailEaseModifier());
        this.currentlyReviewed.card.lapses++;
        this.currentlyReviewed.card.scheduledReview = new Date(Date.now() + this.settings.getRelearningPhaseIntervalInMillis(0));
        this.updateCardInDB(this.currentlyReviewed.card, this.currentlyReviewed.noteId);
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
    this.currentlyReviewed.card.scheduledReview = new Date(Date.now() + this.currentlyReviewed.card.lastIntervalInMillis);
    return this.updateCardInDB(this.currentlyReviewed.card, this.currentlyReviewed.noteId);
  }

  getCardStatusFromCard(card: Card): CardStatus {
    return {
      lastIntervalInMillis: card.lastIntervalInMillis,
      lastReview: card.lastReview,
      scheduledReview: card.scheduledReview,
      stage: card.stage,
      lapses: card.lapses,
      ease: card.ease,
      reviews: card.reviews
    };
  }
}
