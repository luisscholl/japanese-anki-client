import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { faTimes, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lj-japanese-native-recall',
  templateUrl: './japanese-native-recall.component.html',
  styleUrls: ['./japanese-native-recall.component.scss']
})
export class JapaneseNativeRecallComponent implements OnInit {

  faTimes = faTimes;
  faArrowRight = faArrowRight;
  faCheck = faCheck;

  pronunciationVisible = false;
  allVisible = false;

  @Input() card: Card;

  @Output() next: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  showPronunciation(): void {
    this.pronunciationVisible = true;
  }

  fail(): void {
    this.next.emit(true);
  }

  check(): void {
    this.allVisible = true;
  }

  succeed(): void {
    this.next.emit(true);
  }

}
