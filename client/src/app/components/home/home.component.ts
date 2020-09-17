import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { faSun } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lj-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  faSun = faSun;

  constructor() { }

  ngOnInit(): void {
  }

}
