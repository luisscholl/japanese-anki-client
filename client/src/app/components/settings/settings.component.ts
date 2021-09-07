import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from './../../services/settings.service';

@Component({
  selector: 'lj-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public loggedIn = false;
  public userProfile: { username: string } | null = null;

  constructor(
    public settings: SettingsService
  ) { }

  async ngOnInit() {
    this.loggedIn = false;

    if (this.loggedIn) {
      this.userProfile = null;
    }
  }

  login() {
    console.log('Logging in.');
  }

  logout() {
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
