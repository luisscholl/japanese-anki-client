import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { SvgService } from 'src/app/services/svg.service';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lj-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CharacterComponent implements OnInit {

  @Input() character: string;
  svg: SafeHtml;

  constructor(
    private svgService: SvgService
  ) { }

  ngOnInit(): void {
    this.svgService.getFromCharacter(this.character).subscribe(e => {
      console.log(e);
      this.svg = e;
    });
  }
}
