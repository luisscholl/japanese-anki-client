import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'lj-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Villosum';

  @ViewChild('app', { static: false }) appContainer: ElementRef<HTMLDivElement>;

  constructor(
    private oauthService: OAuthService
  ) { }

  ngOnInit(): void {
    this.oauthService.configure(environment.auth);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.setupAutomaticSilentRefresh();
  }

  ngAfterViewInit(): void {
    this.setHeight(null);
  }

  @HostListener('window:resize', ['$event'])
  setHeight(e: Event): void {
    this.appContainer.nativeElement.style.height = window.innerHeight + 'px';
  }
}
