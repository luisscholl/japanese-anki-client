import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { SvgService } from 'src/app/services/svg.service';
import { SafeHtml } from '@angular/platform-browser';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lj-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CharacterComponent implements OnInit {

  faPlayCircle = faPlayCircle;

  @Input() character: string;
  @Input() renderEmpty: boolean;
  svg: string;
  animationDone = true;

  @ViewChild('svgWrapper', { static: false }) svgWrapper: ElementRef<HTMLDivElement>;

  constructor(
    private svgService: SvgService
  ) { }

  ngOnInit(): void {
    this.svgService.getFromCharacter(this.character).subscribe(e => {
      this.svg = e;
      this.svgWrapper.nativeElement.innerHTML = this.svg as string;
    });
  }

  play(): void {
    console.log('play');
    this.animationDone = false;
    this.svgWrapper.nativeElement.innerHTML = '';
    this.svgWrapper.nativeElement.innerHTML = this.svg as string;
  }
}
