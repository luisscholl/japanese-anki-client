import { Component, OnInit } from '@angular/core';
import * as COPYING from 'raw-loader!./../../../../../licenses/COPYING.txt';
import * as LGPL from 'raw-loader!./../../../../../licenses/LGPL.txt';
import * as npmLicenses from 'raw-loader!./../../../../../licenses/npm-licenses.txt';
import * as APL from 'raw-loader!./../../../../../licenses/APL/english/ARPHICPL.txt';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

  COPYING = (COPYING as any).default;
  LGPL = (LGPL as any).default;
  npmLicenses = (npmLicenses as any).default;
  APL = (APL as any).default;

  constructor() { }

  ngOnInit(): void {
  }

}
