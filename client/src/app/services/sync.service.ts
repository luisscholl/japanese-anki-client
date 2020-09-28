import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { environment } from './../../environments/environment';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(
    private storage: StorageMap,
    private http: HttpClient,
    private settingsService: SettingsService
  ) { }

  getDecks(): Observable<string[]> {
    return this.storage.get('decks', { type: 'array', items: { type: 'string' }} );
  }

  updateDeckList(): void {
    this.settingsService.getApiBaseUrl().subscribe(apiBaseUrl => {
    this.http.post(apiBaseUrl, {
      action: 'deckNames',
      version: environment.ankiConnectVersion
    }).subscribe((response: { results: string[], error: string }) => {
      if(!response.error) {
        this.storage.set('decks', response.results, { type: 'array', items: { type: 'string' }});
      }
    });
    });
  }
}
