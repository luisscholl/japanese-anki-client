import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { SvgService } from 'src/app/services/svg.service';
import { SafeHtml } from '@angular/platform-browser';
import { faPlayCircle, faEraser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lj-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CharacterComponent implements OnInit {

  faPlayCircle = faPlayCircle;
  faEraser = faEraser;

  _renderEmpty = false;
  svg: string;
  animationDone = true;

  @Input() character: string;
  @Input()
  set renderEmpty(val: boolean) {
    this._renderEmpty = val;
    if (this.svgWrapper) this.svgWrapper.nativeElement.innerHTML = this._renderEmpty ? '' : this.svg as string;
  };

  @ViewChild('svgWrapper', { static: false }) svgWrapper: ElementRef<HTMLDivElement>;
  @ViewChild('root', { static: false }) root: ElementRef<HTMLDivElement>;

  @Output() erase = new EventEmitter<HTMLDivElement>();

  constructor(
    private svgService: SvgService
  ) { }

  ngOnInit(): void {
    this.svgService.getFromCharacter(this.character).subscribe(e => {
      this.svg = e;
      console.log(this.svg);
      this.svgWrapper.nativeElement.innerHTML = this._renderEmpty ? '' : this.svg as string;
    });
  }

  play(): void {
    console.log('play');
    this.animationDone = false;
    this.svgWrapper.nativeElement.innerHTML = '';
    this.svgWrapper.nativeElement.innerHTML = this.svg as string;
  }

  _erase(): void {
    this.erase.emit(this.root.nativeElement);
  }
}
