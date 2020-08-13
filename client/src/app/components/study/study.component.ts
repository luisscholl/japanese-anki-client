import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lj-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {

  cardType: string;

  constructor() { }

  ngOnInit(): void {
  }

}
