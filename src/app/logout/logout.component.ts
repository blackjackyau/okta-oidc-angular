import { Component, OnInit } from '@angular/core';
import { OidcAuthService } from '../auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: OidcAuthService) { }

  ngOnInit() {
    localStorage.removeItem('okta-ssws');
    this.authService.logout();
  }

}
