import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor() { }

  getProductOfTagEases(card: Card): number {
    // todo
    return 1;
  }
}
