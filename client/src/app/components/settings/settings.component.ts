import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from './../../services/settings.service';
import QrScanner from 'qr-scanner';
const qrScannerWorkerSource = require('!!raw-loader!../../../../node_modules/qr-scanner/qr-scanner-worker.min.js');
console.log(qrScannerWorkerSource.default);
QrScanner.WORKER_PATH = URL.createObjectURL(new Blob([qrScannerWorkerSource.default]));

@Component({
  selector: 'lj-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  hasCamera = false;
  showVideoApiBaseUrl = false;

  @ViewChild('videoApiBaseUrl') videoApiBaseUrl: ElementRef<HTMLVideoElement>;

  constructor(
    public settings: SettingsService
  ) { }

  async ngOnInit() {
    this.hasCamera = true;
    this.settings.setApiBaseUrl(await QrScanner.hasCamera() + '');
  }

  apiBaseUrlChange(e: InputEvent) {
    this.settings.setApiBaseUrl((e.target as HTMLInputElement).value);
  }

  initQRScannerApiBaseUrl() {
    this.showVideoApiBaseUrl = true;
    setTimeout(() => {
      let qrScanner = new QrScanner(this.videoApiBaseUrl.nativeElement, result => {
        this.settings.setApiBaseUrl(result);
      });
      qrScanner.start();
      qrScanner.setCamera('environment');
    });
  }

  userChange(e: InputEvent) {
    this.settings.setUser((e.target as HTMLInputElement).value);
  }

  learningPhaseIntervalsInMinutesChange(e: InputEvent) {
    let intervals: number[] = (e.target as HTMLInputElement).value.replace(/ /g, '').split(',').map(e => parseInt(e));
    if (!intervals.includes(NaN)) this.settings.setLearningPhaseIntervalsInMinutes(intervals);
  }

  relearningPhaseIntervalsInMinutesChange(e: InputEvent) {
    let intervals: number[] = (e.target as HTMLInputElement).value.replace(/ /g, '').split(',').map(e => parseInt(e));
    if (!intervals.includes(NaN)) this.settings.setRelearningPhaseIntervalsInMinutes(intervals);
  }

  graduatingIntervalInDaysChange(e: InputEvent) {
    let interval: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(interval)) this.settings.setGraduatingIntervalInDays(interval);
  }

  graduatingEaseChange(e: InputEvent) {
    let ease: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(ease)) this.settings.setGraduatingEase(ease);
  }

  schedulingDeviationChange(e: InputEvent) {
    let deviation: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(deviation)) this.settings.setSchedulingDeviationInSeconds(deviation);
  }

  easyBonusChange(e: InputEvent) {
    let bonus: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(bonus)) this.settings.setEasyBonus(bonus);
  }

  failEaseModifierChange(e: InputEvent) {
    let modifier: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(modifier)) this.settings.setFailEaseModifier(modifier);
  }

  hardEaseModifierChange(e: InputEvent) {
    let modifier: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(modifier)) this.settings.setHardEaseModifier(modifier);
  }

  goodEaseModifierChange(e: InputEvent) {
    let modifier: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(modifier)) this.settings.setGoodEaseModifier(modifier);
  }

  easyEaseModifierChange(e: InputEvent) {
    let modifier: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(modifier)) this.settings.setEasyEaseModifier(modifier);
  }

  minEaseChange(e: InputEvent) {
    let min: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(min)) this.settings.setMinEase(min);
  }

  relearnPassedIntervalModifierChange(e: InputEvent) {
    let modifier: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(modifier)) this.settings.setRelearnPassedIntervalModifier(modifier);
  }

  minRelearnPassedIntervalInDaysChange(e: InputEvent) {
    let min: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(min)) this.settings.setMinRelearnPassedIntervalInDays(min);
  }

  leechThresholdChange(e: InputEvent) {
    let threshold: number = parseInt((e.target as HTMLInputElement).value.replace(/ /g, ''));
    if (!isNaN(threshold)) this.settings.setLeechThreshold(threshold);
  }

  select(e: FocusEvent) {
    (e.target as HTMLInputElement).select();
  }
}
