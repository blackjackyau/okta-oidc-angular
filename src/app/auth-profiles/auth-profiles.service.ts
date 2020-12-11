import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthProfile } from './auth-profiles.model';


@Injectable({
  providedIn: 'root'
})
export class AuthProfilesService {

  constructor() { }

  list(): Observable<AuthProfile[]> {
    const authProfiles = localStorage.getItem("authProfiles");
    if (authProfiles) {
      return of(JSON.parse(authProfiles));  
    } else {
      of([]);
    }
  }

  save(profiles: AuthProfile[]): Observable<AuthProfile[]> {
    localStorage.setItem("authProfiles", JSON.stringify(profiles));
    return this.list();
  }
}
