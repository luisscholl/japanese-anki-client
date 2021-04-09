import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CharacterComponent } from "../character/character.component";

@Component({
  selector: "lj-scratchpad",
  templateUrl: "./scratchpad.component.html",
  styleUrls: ["./scratchpad.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ScratchpadComponent implements AfterViewInit {
  _word: string;
  _renderEmpty = true;
  penDown = false;
  paths: any[] = [];
  whitespaceCharacters: string[] = [];

  @ViewChild("scratchpad", { static: false })
  canvasWrapper: ElementRef<HTMLDivElement>;
  @ViewChild("canvas", { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild("solutionHightMeasure", { static: false })
  solutionHeightMeasure: CharacterComponent;
  context: CanvasRenderingContext2D;

  @Input()
  set word(val: string) {
    this._word = val;
    this.penDown = false;
    this.paths = [];
    this.canvasWrapper && this.canvasWrapper.nativeElement.scroll(0, 0);
    this.context &&
      this.context.clearRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
  }

  @Input()
  set renderEmpty(val: boolean) {
    this._renderEmpty = val;
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.canvas.nativeElement.height =
      this.canvasWrapper.nativeElement.clientHeight * 1.5;
    this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth;
    this.context = this.canvas.nativeElement.getContext("2d");
    this.context.strokeStyle = "#268bd2";
    // todo: dynamic line width; good enough for now
    this.context.lineWidth = 10;
  }

  mousemove(e: MouseEvent): void {
    if (e.buttons % 2 !== 1) {
      // left mouse button (and possibly some other button) is pressed
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
        e.touches[0].clientY - boundingBox.y,
      ];
    } else {
      e = e as MouseEvent;
      return [e.clientX - boundingBox.x, e.clientY - boundingBox.y];
    }
  }

  endPath(e): void {
    this.penDown = false;
    this.context.closePath();
  }

  onScroll(e: WheelEvent) {
    if (
      this.canvasWrapper.nativeElement.scrollTop >
      this.canvas.nativeElement.clientHeight -
        1.5 * this.canvasWrapper.nativeElement.clientHeight
    ) {
      let imageData: ImageData = this.context.getImageData(
        0,
        0,
        this.canvas.nativeElement.clientWidth,
        this.canvas.nativeElement.clientHeight
      );
      this.canvas.nativeElement.height =
        this.canvas.nativeElement.clientHeight +
        0.5 * this.canvasWrapper.nativeElement.clientHeight;
      this.context.putImageData(imageData, 0, 0);
      this.context.strokeStyle = "#268bd2";
      // todo: dynamic line width; good enough for now
      this.context.lineWidth = 10;
      // this throws errors and causes performance issues when user scrolls down a lot,
      // because of a lot of DOM elements. However it is no issue with normal use and in
      // case of failure, the user can click to proceed.
      if (
        this.solutionHeightMeasure.root.nativeElement.getBoundingClientRect()
          .y <
        this.canvas.nativeElement.getBoundingClientRect().height +
          this.canvas.nativeElement.getBoundingClientRect().y
      ) {
        let n =
          (this.canvas.nativeElement.getBoundingClientRect().height +
            this.canvas.nativeElement.getBoundingClientRect().height -
            this.solutionHeightMeasure.root.nativeElement.getBoundingClientRect()
              .height) /
            this.solutionHeightMeasure.root.nativeElement.getBoundingClientRect()
              .height +
          1;
        for (let i = 0; i < n; i++) this.whitespaceCharacters.push("");
      }
    }
  }

  erase(e: HTMLDivElement) {
    let x =
      e.getBoundingClientRect().x -
      this.canvas.nativeElement.getBoundingClientRect().x;
    let y =
      e.getBoundingClientRect().y -
      this.canvas.nativeElement.getBoundingClientRect().y;
    let width = e.getBoundingClientRect().width;
    let height = e.getBoundingClientRect().height;
    this.context.clearRect(x, y, width, height);
  }

  scrollTop(): void {
    this.canvasWrapper.nativeElement.scrollTo(0, 0);
  }
}
