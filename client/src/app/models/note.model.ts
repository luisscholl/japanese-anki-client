export class Note {
  id: string;
  japanese: string;
  japanesePronunciation?: string;
  native: string;
  cardStatus: Map<'native-japanese-writing' | 'japanese-native-recall', {
    score: number;
    lastReview: Date
    succeededOnLastReview: boolean;
  }>;
  score: number;
  lastReview: Date;
  succeedOnLastReview: boolean;
  lastUpdate: Date;
  update: 'create' | 'update' | 'delete' | 'update_score';
}
