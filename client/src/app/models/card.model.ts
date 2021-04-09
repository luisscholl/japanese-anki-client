export class Card {
  type: "new-card" | "native-japanese-writing" | "japanese-native-recall";
  japanese: string;
  japanesePronunciation?: string;
  native: string;
  stage: "new" | "learn" | "review" | "relearn";
  lapses: number;
  ease: number;
  reviews: number;
  lastIntervalInMillis: number;
  lastReview: Date;
  scheduledReview: Date;
  tags: string[];
}
