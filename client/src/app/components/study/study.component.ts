import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'lj-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {

  card: Card;

  constructor(
    private noteService: NoteService
  ) { }

  ngOnInit(): void {
    this.noteService.initReviewSessionAndGetFirstCard().then(card => {
      this.card = card;
      if (!this.card) {
        alert('Finished all due cards! :)');
        history.back();
      }
    })
  }

  next(succeeded: 'fail' | 'hard' | 'good' | 'easy') {
    this.noteService.scheduleCurrentCardAndGetNext(succeeded).then(card => {
      // todo: Check for null and tell the user that they are done or similar.
      console.log(card);
      this.card = card;
      if (!this.card) {
        alert('Finished all due cards! :)');
        history.back();
      }
    });
  }

}
