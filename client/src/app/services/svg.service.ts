import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  constructor(
    private http: HttpClient
  ) { }

  getFromCharacter(character: string): Observable<string> {
    if (character === '') return of(null);
    return this.http.get(`${environment.baseUrl}/assets/jaSVGs/${character.charCodeAt(0)}.svg`, { responseType: 'text' })
    .pipe(
      catchError(err => of(`<div class="fallback">${character}</div>`)),
      map(e => `<div class="svg">${e}</div>`)
    );
  }
}
