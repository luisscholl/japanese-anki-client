import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { faTimes, faArrowRight, faCheck, faEyeSlash, faEye, faCrown, faFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { type } from 'os';
import { CharacterComponent } from '../character/character.component';
import { ScratchpadComponent } from '../scratchpad/scratchpad.component';

@Component({
  selector: 'lj-native-japanese-writing',
  templateUrl: './native-japanese-writing.component.html',
  styleUrls: ['./native-japanese-writing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NativeJapaneseWritingComponent {

  faArrowRight = faArrowRight;
  faTimes = faTimes;
  faFrownOpen = faFrownOpen;
  faCheck = faCheck;
  faCrown = faCrown;
  faEyeSlash = faEyeSlash;
  faEye = faEye;

  _card: Card;
  allVisible = false;
  nativeVisible = true;

  @Input()
  set card(val: Card) {
    this._card = val;
    this.allVisible = false;
    this.nativeVisible = true;
  }

  @Output() next: EventEmitter<'fail' | 'hard' | 'good' | 'easy'> = new EventEmitter();

  @ViewChild(ScratchpadComponent) scratchpad: ScratchpadComponent;

  constructor() { }

  check(): void {
    this.allVisible = true;
    this.scratchpad.scrollTop();
  }

  hideNative() {
    this.nativeVisible = false;
  }

  showNative() {
    this.nativeVisible = true;
  }

  _next(quality: 'fail' | 'hard' | 'good' | 'easy'): void {
    this.next.emit(quality);
  }
}
