import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { faTimes, faArrowRight, faCheck, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { type } from 'os';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'lj-native-japanese-writing',
  templateUrl: './native-japanese-writing.component.html',
  styleUrls: ['./native-japanese-writing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NativeJapaneseWritingComponent implements OnInit, AfterViewInit {

  faTimes = faTimes;
  faArrowRight = faArrowRight;
  faCheck = faCheck;
  faEyeSlash = faEyeSlash;
  faEye = faEye;

  _card: Card;
  allVisible = false;
  nativeVisible = true;
  penDown = false;
  paths: any[] = [];
  whitespaceCharacters: string[] = [];

  @ViewChild('canvasWrapper', { static: false }) canvasWrapper: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('solutionHightMeasure', { static: false }) solutionHeightMeasure: CharacterComponent;
  context: CanvasRenderingContext2D;

  @Input()
  set card(val: Card) {
    this._card = val;
    this.allVisible = false;
    this.penDown = false;
    this.paths = [];
    this.context && this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  @Output() next: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.height = this.canvasWrapper.nativeElement.clientHeight * 1.5;
    this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth;
    this.context = this.canvas.nativeElement.getContext('2d');
    this.context.strokeStyle = '#268bd2';
    // to-do: dynamic line width; good enough for now
    this.context.lineWidth = 10;
  }

  fail(): void {
    this.next.emit(true);
  }

  check(): void {
    this.allVisible = true;
    this.canvasWrapper.nativeElement.scrollTo(0, 0);
  }

  succeed(): void {
    this.next.emit(true);
  }

  mousemove(e: MouseEvent): void {
    if (e.buttons % 2 !== 1) { // left mouse button (and possibly some other button) is pressed
      this.penDown = false;
      return;
    }
    if (!this.penDown) {
      this.penDown = true;
      this.context.beginPath();
    }
    // replace with bezierCurveTo()
    this.context.lineTo(...this.getCanvasCords(e));
    this.context.stroke();
  }

  touchmove(e: TouchEvent): void {
    e.preventDefault();
    if (!this.penDown) {
      this.penDown = true;
      this.context.beginPath();
    }
    this.context.lineTo(...this.getCanvasCords(e));
    this.context.stroke();
  }

  getCanvasCords(e: MouseEvent | TouchEvent): [number, number] {
    let boundingBox = this.canvas.nativeElement.getBoundingClientRect();
    if ((e as TouchEvent).touches) {
      e = e as TouchEvent;
      return [
        e.touches[0].clientX - boundingBox.x,
        e.touches[0].clientY - boundingBox.y
      ];
    } else {
      e = e as MouseEvent;
      return [
        e.clientX - boundingBox.x,
        e.clientY - boundingBox.y
      ];
    }
  }

  endPath(e): void {
    this.penDown = false;
    this.context.closePath();
  }

  onScroll(e: WheelEvent) {
    if (this.canvasWrapper.nativeElement.scrollTop >
      this.canvas.nativeElement.clientHeight - 1.5 * this.canvasWrapper.nativeElement.clientHeight) {
        let imageData: ImageData = 
          this.context.getImageData(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientHeight);
        this.canvas.nativeElement.height = 
          this.canvas.nativeElement.clientHeight + 0.5 * this.canvasWrapper.nativeElement.clientHeight;
        this.context.putImageData(imageData, 0, 0);
        this.context.strokeStyle = '#268bd2';
        // to-do: dynamic line width; good enough for now
        this.context.lineWidth = 10;
        // this throws errors and causes performance issues when user scrolls down a lot,
        // because of a lot of DOM elements. However it is no issue with normal use and in
        // case of failure, the user can click to proceed.
        if (this.solutionHeightMeasure.root.nativeElement.getBoundingClientRect().y < this.canvas.nativeElement.getBoundingClientRect().height + this.canvas.nativeElement.getBoundingClientRect().y) {
          let n = (this.canvas.nativeElement.getBoundingClientRect().height + this.canvas.nativeElement.getBoundingClientRect().height - this.solutionHeightMeasure.root.nativeElement.getBoundingClientRect().height) / this.solutionHeightMeasure.root.nativeElement.getBoundingClientRect().height + 1;
          for (let i=0; i<n; i++) this.whitespaceCharacters.push('');
        }
    }
  }

  erase(e: HTMLDivElement) {
    let x = e.getBoundingClientRect().x - this.canvas.nativeElement.getBoundingClientRect().x;
    let y = e.getBoundingClientRect().y - this.canvas.nativeElement.getBoundingClientRect().y;
    let width = e.getBoundingClientRect().width;
    let height = e.getBoundingClientRect().height;
    this.context.clearRect(x, y, width, height);
  }

  hideNative() {
    this.nativeVisible = false;
  }

  showNative() {
    this.nativeVisible = true;
  }
}
