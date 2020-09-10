import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { faTimes, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { type } from 'os';

@Component({
  selector: 'lj-native-japanese-writing',
  templateUrl: './native-japanese-writing.component.html',
  styleUrls: ['./native-japanese-writing.component.scss']
})
export class NativeJapaneseWritingComponent implements OnInit, AfterViewInit {

  faTimes = faTimes;
  faArrowRight = faArrowRight;
  faCheck = faCheck;

  allVisible = false;
  penDown = false;
  paths: any[] = [];

  @ViewChild('canvasWrapper', { static: false }) canvasWrapper: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  @Input() card: Card;

  @Output() next: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.height = this.canvasWrapper.nativeElement.clientHeight * 1.5;
    this.canvas.nativeElement.width = this.canvasWrapper.nativeElement.clientWidth;
    this.context = this.canvas.nativeElement.getContext('2d');
  }

  fail(): void {
    this.next.emit(true);
  }

  check(): void {
    this.allVisible = true;
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

  onScroll(e: MouseWheelEvent) {
    if (this.canvasWrapper.nativeElement.scrollTop >
      this.canvas.nativeElement.clientHeight - 1.5 * this.canvasWrapper.nativeElement.clientHeight) {
        let imageData: ImageData = 
          this.context.getImageData(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientHeight);
        this.canvas.nativeElement.height = 
          this.canvas.nativeElement.clientHeight + 0.5 * this.canvasWrapper.nativeElement.clientHeight;
        this.context.putImageData(imageData, 0, 0);
    }
  }
}
