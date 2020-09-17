import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'lj-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'client';

  @ViewChild('app', { static: false }) appContainer: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.setHeight(null);
  }

  @HostListener('window:resize', ['$event'])
  setHeight(e: Event): void {
    this.appContainer.nativeElement.style.height = window.innerHeight + 'px';
  }
}
