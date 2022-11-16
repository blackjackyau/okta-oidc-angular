import { Component, OnInit } from '@angular/core';
import { Log } from 'oidc-client-ts'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'okta-oidc-angular-rxjs';

  ngOnInit() {
    Log.setLevel(Log.DEBUG);
  }

}
