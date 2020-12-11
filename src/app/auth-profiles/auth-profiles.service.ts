import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthProfile } from './auth-profiles.model';


@Injectable({
  providedIn: 'root'
})
export class AuthProfilesService {

  constructor() { }

  list(): AuthProfile[] {
    const authProfiles = localStorage.getItem("authProfiles");
    if (authProfiles) {
      return JSON.parse(authProfiles);  
    } else {
      return [];
    }
  }

  save(profiles: AuthProfile[]): AuthProfile[] {
    localStorage.setItem("authProfiles", JSON.stringify(profiles));
    return this.list();
  }
}
