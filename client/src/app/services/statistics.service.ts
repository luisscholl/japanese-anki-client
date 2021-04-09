import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }

  getGlobalIntervalModifier(): number {
    // todo
    return 1;
  }
}
