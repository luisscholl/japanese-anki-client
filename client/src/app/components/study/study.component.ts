import { Component, OnInit } from '@angular/core';
import { CardService } from './../../services/card.service';
import { Card } from 'src/app/models/card.model';

@Component({
  selector: 'lj-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {

  card: Card;

  constructor(
    private cardService: CardService
  ) { }

  ngOnInit(): void {
    this.card = this.cardService.first();
  }

  next(succeeded: boolean) {
    this.card = this.cardService.next(succeeded);
  }

}
