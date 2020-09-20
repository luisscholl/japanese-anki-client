import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private storage: StorageMap
  ) { }

  getApiBaseUrl(): Observable<string> {
    return this.storage.get('apiBaseUrl', { type: 'string' });
  }

  setApiBaseUrl(host: string): void {
    // subscribe is required
    this.storage.set('apiBaseUrl', host, { type: 'string' }).subscribe();
  }
}
