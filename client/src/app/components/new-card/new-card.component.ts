import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Card } from 'src/app/models/card.model';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'lj-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewCardComponent {

  faCheck = faCheck;

  _card: Card;
 
  @Output() next: EventEmitter<'good'> = new EventEmitter();

  constructor() { }

  @Input()
  set card(val: Card) {
    this._card = val;
  }

  succeed(): void {
    this.next.emit('good');
  }
}
