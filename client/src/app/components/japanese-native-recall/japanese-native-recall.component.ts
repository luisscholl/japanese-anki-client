import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { faTimes, faArrowRight, faCheck, faFrownOpen, faCrown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lj-japanese-native-recall',
  templateUrl: './japanese-native-recall.component.html',
  styleUrls: ['./japanese-native-recall.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JapaneseNativeRecallComponent implements OnInit {

  faArrowRight = faArrowRight;
  faTimes = faTimes;
  faFrownOpen = faFrownOpen;
  faCheck = faCheck;
  faCrown = faCrown;

  _card: Card;
  pronunciationVisible = false;
  allVisible = false;

  @Input()
  set card(val: Card) {
    this._card = val;
    this.allVisible = false;
    this.pronunciationVisible = false;
  }

  @Output() next: EventEmitter<'fail' | 'hard' | 'good' | 'easy'> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  showPronunciation(): void {
    this.pronunciationVisible = true;
  }

  check(): void {
    this.allVisible = true;
  }

  _next(quality: 'fail' | 'hard' | 'good' | 'easy'): void {
    this.next.emit(quality);
  }
}
