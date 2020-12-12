import { Injectable } from '@angular/core';
import { AuthProfileData } from './auth-profiles.model';


@Injectable({
  providedIn: 'root'
})
export class AuthProfilesService {

  constructor() { }

  getData(): AuthProfileData {
    const authProfileData = localStorage.getItem("authProfileData");
    if (authProfileData) {
      return JSON.parse(authProfileData);  
    } else {
      return {
        selected: undefined,
        profiles: []
      };
    }
  }

  save(profileData: AuthProfileData): AuthProfileData {
    localStorage.setItem("authProfileData", JSON.stringify(profileData));
    return this.getData();
  }
}
