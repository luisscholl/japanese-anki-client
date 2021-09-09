import { Component, OnInit } from '@angular/core';
import * as COPYING from 'raw-loader!./../../../../../licenses/COPYING.txt';
import * as LGPL from 'raw-loader!./../../../../../licenses/LGPL.txt';
import * as clientLicenses from 'raw-loader!./../../../../../licenses/client-licenses.txt';
import * as backendLicenses from 'raw-loader!./../../../../../licenses/backend-licenses.txt';
import * as authLicenses from 'raw-loader!./../../../../../licenses/auth-licenses.txt';
import * as genericLicenses from 'raw-loader!./../../../../../licenses/generic-licenses.txt';
import * as APL from 'raw-loader!./../../../../../licenses/APL/english/ARPHICPL.txt';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

  COPYING = (COPYING as any).default;
  LGPL = (LGPL as any).default;
  clientLicenses = (clientLicenses as any).default;
  backendLicenses = (backendLicenses as any).default;
  authLicenses = (authLicenses as any).default;
  genericLicenses = (genericLicenses as any).default;
  APL = (APL as any).default;

  constructor() { }

  ngOnInit(): void {
  }

}
