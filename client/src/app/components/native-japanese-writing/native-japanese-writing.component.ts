import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from 'src/app/models/card.model';

@Component({
  selector: 'lj-native-japanese-writing',
  templateUrl: './native-japanese-writing.component.html',
  styleUrls: ['./native-japanese-writing.component.scss']
})
export class NativeJapaneseWritingComponent implements OnInit {

  @Input() card: Card;

  @Output() next: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
