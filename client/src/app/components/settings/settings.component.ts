import { Component, OnInit } from '@angular/core';
import { SettingsService } from './../../services/settings.service';
import { SyncService } from './../../services/sync.service';

@Component({
  selector: 'lj-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private settingsService: SettingsService,
    private syncService: SyncService
  ) { }

  apiBaseUrl = '';
  decks: string[] = [];

  ngOnInit(): void { 
    this.settingsService.getApiBaseUrl().subscribe(apiBaseUrl => {
      if (apiBaseUrl) this.apiBaseUrl = apiBaseUrl;
    });
  }

  apiBaseUrlChange(e: InputEvent) {
    this.apiBaseUrl = (e.target as HTMLInputElement).value;
    this.settingsService.setApiBaseUrl(this.apiBaseUrl);
    this.syncService.updateDeckList();
    this.syncService.getDecks().subscribe(e => this.decks = e);
    console.log(this.decks);
  }

  select(e: FocusEvent) {
    (e.target as HTMLInputElement).select();
  }
}
