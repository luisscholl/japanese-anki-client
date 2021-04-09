export class Note {
  _id: string;
  japanese: string;
  japanesePronunciation?: string;
  native: string;
  cardStatus:
    | {
        "native-japanese-writing": CardStatus;
        "japanese-native-recall": CardStatus;
      }
    | {
        "new-card": CardStatus;
      };
  lastUpdate: Date;
  update: "create" | "update" | "delete" | "review";
  tags: string[];
}

export class CardStatus {
  lastIntervalInMillis: number;
  lastReview: Date;
  scheduledReview: Date;
  stage: "new" | "learn" | "review" | "relearn";
  lapses: number;
  ease: number;
  reviews: number;
}
