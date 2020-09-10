import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  constructor(
    private http: HttpClient,
    private sanitzer: DomSanitizer
  ) { }

  getFromCharacter(character: string): Observable<SafeHtml> {
    return this.http.get(`/assets/jaSVGs/${character.charCodeAt(0)}.svg`, { responseType: 'text' })
    .pipe(
      catchError(err => of(`<div class="fallback">${character}</div>`)),
      map(e => this.sanitzer.bypassSecurityTrustHtml(`<div class="svg">${e}</div>`))
    );
  }
}
