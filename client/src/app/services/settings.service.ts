// This service feels stupidly redundant.

import { Injectable } from "@angular/core";
import { StorageMap } from "@ngx-pwa/local-storage";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private apiBaseUrl: BehaviorSubject<string>;
  private learningPhaseIntervalsInMillis: BehaviorSubject<number[]>;
  private learningPhaseIntervalsInMinutes: BehaviorSubject<number[]>;
  private relearningPhaseIntervalsInMillis: BehaviorSubject<number[]>;
  private relearningPhaseIntervalsInMinutes: BehaviorSubject<number[]>;
  private graduatingIntervalInMillis: BehaviorSubject<number>;
  private graduatingIntervalInDays: BehaviorSubject<number>;
  private graduatingEase: BehaviorSubject<number>;
  private schedulingDeviationInMillis: BehaviorSubject<number>;
  private schedulingDeviationInSeconds: BehaviorSubject<number>;
  private easyBonus: BehaviorSubject<number>;
  private failEaseModifier: BehaviorSubject<number>;
  private hardEaseModifier: BehaviorSubject<number>;
  private goodEaseModifier: BehaviorSubject<number>;
  private easyEaseModifier: BehaviorSubject<number>;
  private minEase: BehaviorSubject<number>;
  private relearnPassedIntervalModifier: BehaviorSubject<number>;
  private minRelearnPassedIntervalInMillis: BehaviorSubject<number>;
  private minRelearnPassedIntervalInDays: BehaviorSubject<number>;
  private leechThreshold: BehaviorSubject<number>;

  constructor(private storage: StorageMap) {
    this.apiBaseUrl = new BehaviorSubject<string>(environment.apiBaseUrl);
    this.learningPhaseIntervalsInMillis = new BehaviorSubject<number[]>(environment.learningPhaseIntervalsInMinutes.map(e => e * 60 * 1000));
    this.learningPhaseIntervalsInMinutes = new BehaviorSubject<number[]>(environment.learningPhaseIntervalsInMinutes);
    this.relearningPhaseIntervalsInMillis = new BehaviorSubject<number[]>(environment.relearningPhaseIntervalsInMinutes.map(e => e * 60 * 1000));
    this.relearningPhaseIntervalsInMinutes = new BehaviorSubject<number[]>(environment.relearningPhaseIntervalsInMinutes);
    this.graduatingIntervalInMillis = new BehaviorSubject<number>(environment.graduatingIntervalInDays * 24 * 60 * 60 * 1000);
    this.graduatingIntervalInDays = new BehaviorSubject<number>(environment.graduatingIntervalInDays);
    this.graduatingEase = new BehaviorSubject<number>(environment.graduatingEase);
    this.schedulingDeviationInMillis = new BehaviorSubject<number>(environment.schedulingDeviationInSeconds * 1000);
    this.schedulingDeviationInSeconds = new BehaviorSubject<number>(environment.schedulingDeviationInSeconds);
    this.easyBonus = new BehaviorSubject<number>(environment.easyBonus);
    this.failEaseModifier = new BehaviorSubject<number>(environment.easeModifiers.fail);
    this.hardEaseModifier = new BehaviorSubject<number>(environment.easeModifiers.hard);
    this.goodEaseModifier = new BehaviorSubject<number>(environment.easeModifiers.good);
    this.easyEaseModifier = new BehaviorSubject<number>(environment.easeModifiers.easy);
    this.minEase = new BehaviorSubject<number>(environment.minEase);
    this.relearnPassedIntervalModifier = new BehaviorSubject<number>(environment.relearnPassedIntervalModifier);
    this.minRelearnPassedIntervalInMillis = new BehaviorSubject<number>(environment.minRelearnPassedIntervalInDays * 24 * 60 * 60 * 1000);
    this.minRelearnPassedIntervalInDays = new BehaviorSubject<number>(environment.minRelearnPassedIntervalInDays);
    this.leechThreshold = new BehaviorSubject<number>(environment.leechThreshold);
    this.storage.get("apiBaseUrl", { type: "string" }).subscribe({
      next: apiBaseUrl => {
        if (!apiBaseUrl) return;
        this.apiBaseUrl.next(apiBaseUrl);
      }
    });
    this.storage.get("learningPhaseIntervalsInMinutes", { type: "array", items: { type: "number" } }).subscribe({
      next: learningPhaseIntervalsInMinutes => {
        if (!learningPhaseIntervalsInMinutes) return;
        this.learningPhaseIntervalsInMillis.next(learningPhaseIntervalsInMinutes.map(e => e * 60 * 1000));
        this.learningPhaseIntervalsInMinutes.next(learningPhaseIntervalsInMinutes);
      }
    });
    this.storage.get("relearningPhaseIntervalsInMinutes", { type: "array", items: { type: "number" } }).subscribe({
      next: relearningPhaseIntervalsInMinutes => {
        if (!relearningPhaseIntervalsInMinutes) return;
        this.relearningPhaseIntervalsInMillis.next(relearningPhaseIntervalsInMinutes.map(e => e * 60 * 1000));
        this.relearningPhaseIntervalsInMinutes.next(relearningPhaseIntervalsInMinutes);
      }
    });
    this.storage.get("graduatingIntervalInDays", { type: "number" }).subscribe({
      next: graduatingIntervalInDays => {
        if (!graduatingIntervalInDays) return;
        this.graduatingIntervalInMillis.next(graduatingIntervalInDays * 24 * 60 * 60 * 1000);
        this.graduatingIntervalInDays.next(graduatingIntervalInDays);
      }
    });
    this.storage.get("graduatingEase", { type: "number" }).subscribe({
      next: graduatingEase => {
        if (!graduatingEase) return;
        this.graduatingEase.next(graduatingEase);
      }
    });
    this.storage.get("schedulingDeviationInSeconds", { type: "number" }).subscribe({
      next: schedulingDeviationInSeconds => {
        if (!schedulingDeviationInSeconds) return;
        this.schedulingDeviationInMillis.next(schedulingDeviationInSeconds * 1000);
        this.schedulingDeviationInSeconds.next(schedulingDeviationInSeconds);
      }
    });
    this.storage.get("easyBonus", { type: "number" }).subscribe({
      next: easyBonus => {
        if (!easyBonus) return;
        this.easyBonus.next(easyBonus);
      }
    });
    this.storage.get("failEaseModifier", { type: "number" }).subscribe({
      next: failEaseModifier => {
        if (!failEaseModifier) return;
        this.failEaseModifier.next(failEaseModifier);
      }
    });
    this.storage.get("hardEaseModifier", { type: "number" }).subscribe({
      next: hardEaseModifier => {
        if (!hardEaseModifier) return;
        this.hardEaseModifier.next(hardEaseModifier);
      }
    });
    this.storage.get("goodEaseModifier", { type: "number" }).subscribe({
      next: goodEaseModifier => {
        if (!goodEaseModifier) return;
        this.goodEaseModifier.next(goodEaseModifier);
      }
    });
    this.storage.get("easyEaseModifier", { type: "number" }).subscribe({
      next: easyEaseModifier => {
        if (!easyEaseModifier) return;
        this.easyEaseModifier.next(easyEaseModifier);
      }
    });
    this.storage.get("minEase", { type: "number" }).subscribe({
      next: minEase => {
        if (!minEase) return;
        this.minEase.next(minEase);
      }
    });
    this.storage.get("relearnPassedIntervalModifier", { type: "number" }).subscribe({
      next: relearnPassedIntervalModifier => {
        if (!relearnPassedIntervalModifier) return;
        this.relearnPassedIntervalModifier.next(relearnPassedIntervalModifier);
      }
    });
    this.storage.get("minRelearnPassedIntervalInDays", { type: "number" }).subscribe({
      next: minRelearnPassedIntervalInDays => {
        if (!minRelearnPassedIntervalInDays) return;
        this.minRelearnPassedIntervalInMillis.next(minRelearnPassedIntervalInDays * 24 * 60 * 60 * 1000);
        this.minRelearnPassedIntervalInDays.next(minRelearnPassedIntervalInDays);
      }
    });
    this.storage.get("leechThreshold", { type: "number" }).subscribe({
      next: leechThreshold => {
        if (!leechThreshold) return;
        this.leechThreshold.next(leechThreshold);
      }
    });
  }

  getApiBaseUrl(): string {
    return this.apiBaseUrl.value;
  }

  setApiBaseUrl(host: string): void {
    this.apiBaseUrl.next(host);
    this.storage.set("apiBaseUrl", host, { type: "string" }).subscribe();
  }

  getLearningPhaseIntervalInMillis(n: number): number {
    return this.learningPhaseIntervalsInMillis.value[n] || -1;
  }

  getLearningPhaseIntervalsInMinutes(): number[] {
    return this.learningPhaseIntervalsInMinutes.value;
  }

  setLearningPhaseIntervalsInMinutes(intervals: number[]) {
    this.learningPhaseIntervalsInMillis.next(intervals.map(e => e * 60 * 1000));
    this.learningPhaseIntervalsInMinutes.next(intervals);
    this.storage.set("learningPhaseIntervalsInMinutes", intervals, { type: "array", items: { type: "number" } }).subscribe();
  }

  getRelearningPhaseIntervalInMillis(n: number): number {
    return this.relearningPhaseIntervalsInMillis.value[n] || -1;
  }

  getRelearningPhaseIntervalsInMinutes(): number[] {
    return this.relearningPhaseIntervalsInMinutes.value;
  }

  setRelearningPhaseIntervalsInMinutes(intervals: number[]) {
    this.relearningPhaseIntervalsInMillis.next(intervals.map(e => e * 60 * 1000));
    this.relearningPhaseIntervalsInMinutes.next(intervals);
    this.storage.set("relearningPhaseIntervalsInMinutes", intervals, { type: "array", items: { type: "number" } }).subscribe();
  }

  getGraduatingIntervalInMillis(): number {
    return this.graduatingIntervalInMillis.value;
  }

  getGraduatingIntervalInDays(): number {
    return this.graduatingIntervalInDays.value;
  }

  setGraduatingIntervalInDays(days: number) {
    this.graduatingIntervalInMillis.next(days * 24 * 60 * 60 * 100);
    this.graduatingIntervalInDays.next(days);
    this.storage.set("graduatingIntervalInDays", days, { type: "number" }).subscribe();
  }

  getGraduatingEase(): number {
    return this.graduatingEase.value;
  }

  setGraduatingEase(graduatingEase: number): void {
    this.graduatingEase.next(graduatingEase);
    this.storage.set("graduatingEase", graduatingEase, { type: "number" }).subscribe();
  }

  getSchedulingDeviationInMillis(): number {
    return this.schedulingDeviationInMillis.value;
  }

  getSchedulingDeviationInSeconds(): number {
    return this.schedulingDeviationInSeconds.value;
  }

  setSchedulingDeviationInSeconds(schedulingDeviationInSeconds: number) {
    this.schedulingDeviationInMillis.next(schedulingDeviationInSeconds * 1000);
    this.schedulingDeviationInSeconds.next(schedulingDeviationInSeconds);
    this.storage.set("schedulingDeviationInSeconds", schedulingDeviationInSeconds, { type: "number" }).subscribe();
  }

  getEasyBonus(): number {
    return this.easyBonus.value;
  }

  setEasyBonus(easyBonus: number) {
    this.easyBonus.next(easyBonus);
    this.storage.set("easyBonus", easyBonus, { type: "number" }).subscribe();
  }

  getFailEaseModifier(): number {
    return this.failEaseModifier.value;
  }

  setFailEaseModifier(failEaseModifier: number) {
    this.failEaseModifier.next(failEaseModifier);
    this.storage.set("failEaseModifier", failEaseModifier, { type: "number" }).subscribe();
  }

  getHardEaseModifier(): number {
    return this.hardEaseModifier.value;
  }

  setHardEaseModifier(hardEaseModifier: number) {
    this.hardEaseModifier.next(hardEaseModifier);
    this.storage.set("hardEaseModifier", hardEaseModifier, { type: "number" }).subscribe();
  }

  getGoodEaseModifier(): number {
    return this.goodEaseModifier.value;
  }

  setGoodEaseModifier(goodEaseModifier: number) {
    this.goodEaseModifier.next(goodEaseModifier);
    this.storage.set("goodEaseModifier", goodEaseModifier, { type: "number" }).subscribe();
  }

  getEasyEaseModifier(): number {
    return this.easyEaseModifier.value;
  }

  setEasyEaseModifier(easyEaseModifier: number) {
    this.easyEaseModifier.next(easyEaseModifier);
    this.storage.set("easyEaseModifier", easyEaseModifier, { type: "number" }).subscribe();
  }

  getMinEase(): number {
    return this.minEase.value;
  }

  setMinEase(minEase: number) {
    this.minEase.next(minEase);
    this.storage.set("minEase", minEase, { type: "number" }).subscribe();
  }

  getRelearnPassedIntervalModifier(): number {
    return this.relearnPassedIntervalModifier.value;
  }

  setRelearnPassedIntervalModifier(relearnPassedIntervalModifier: number) {
    this.relearnPassedIntervalModifier.next(relearnPassedIntervalModifier);
    this.storage.set("relearnPassedIntervalModifier", relearnPassedIntervalModifier, { type: "number" }).subscribe();
  }

  getMinRelearnPassedIntervalInMillis(): number {
    return this.minRelearnPassedIntervalInMillis.value;
  }

  getMinRelearnPassedIntervalInDays(): number {
    return this.minRelearnPassedIntervalInDays.value;
  }

  setMinRelearnPassedIntervalInDays(minRelearnPassedIntervalInDays: number) {
    this.minRelearnPassedIntervalInDays.next(minRelearnPassedIntervalInDays);
    this.storage.set("minRelearnPassedIntervalInMillis", minRelearnPassedIntervalInDays * 24 * 60 * 60, { type: "number" }).subscribe();
    this.storage.set("minRelearnPassedIntervalInDays", minRelearnPassedIntervalInDays, { type: "number" }).subscribe();
  }

  getLeechThreshold(): number {
    return this.leechThreshold.value;
  }

  setLeechThreshold(leechThreshold: number) {
    this.leechThreshold.next(leechThreshold);
    this.storage.set("leechThreshold", leechThreshold, { type: "number" }).subscribe();
  }
}
