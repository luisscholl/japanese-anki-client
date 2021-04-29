export class Note {
  _id: string;
  _rev?: string;
  japanese: string;
  japanesePronunciation?: string;
  native: string;
  cardStatus: CardStatus[];
  tags: string[];
}

export class CardStatus {
  type: "new-card" | "native-japanese-writing" | "japanese-native-recall";
  lastIntervalInMillis: number;
  lastReview: string;
  scheduledReview: string;
  stage: "new" | "learn" | "review" | "relearn";
  lapses: number;
  ease: number;
  reviews: number;
}
