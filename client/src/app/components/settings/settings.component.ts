import { Component, OnInit } from '@angular/core';
import { SettingsService } from './../../services/settings.service';

@Component({
  selector: 'lj-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private settingsService: SettingsService
  ) { }

  apiBaseUrl = '';

  ngOnInit(): void { 
    this.settingsService.getApiBaseUrl().subscribe(apiBaseUrl => {
      if (apiBaseUrl) this.apiBaseUrl = apiBaseUrl;
    });
  }

  apiBaseUrlChange(e: InputEvent) {
    this.apiBaseUrl = (e.target as HTMLInputElement).value;
    this.settingsService.setApiBaseUrl(this.apiBaseUrl);
  }

  select(e: FocusEvent) {
    (e.target as HTMLInputElement).select();
  }
}
