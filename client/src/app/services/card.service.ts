import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
// This service currently uses mock data in order to enable targeted development on components
export class CardService {

  counter: number = 0;
  cards: Card[] = [
    {
      "type": "japanese-native-recall",
      "japanese": "日本語",
      "japanesePronunciation": "にほんご",
      "native": "Japanese",
      "score": 0
    },{
      "type": "native-japanese-writing",
      "japanese": "人間",
      "japanesePronunciation": "にんげん",
      "native": "human",
      "score": 0
    },{
      "type": "japanese-native-recall",
      "japanese": "水曜日",
      "japanesePronunciation": "すいようび",
      "native": "Wednesday",
      "score": 0
    }
  ]

  constructor() { }

  // Returns a card
  first(): Card {
    return this.cards[0];
  }

  // Scores current card and returns next card
  next(succeeded: boolean): Card {
    this.counter = (this.counter + 1) % 3;
    return this.cards[this.counter];
  }
}
