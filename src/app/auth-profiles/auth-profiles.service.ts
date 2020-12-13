import { Injectable } from '@angular/core';
import { AuthProfile, AuthProfileData } from './auth-profiles.model';


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

  getActiveProfile(): AuthProfile {
    const authProfileData = this.getData();
    console.log(authProfileData);
    if (authProfileData.selected !== undefined) {
      return authProfileData.profiles[authProfileData.selected];
    } else {
      return undefined;
    }
  }

  save(profileData: AuthProfileData): AuthProfileData {
    localStorage.setItem("authProfileData", JSON.stringify(profileData));
    return this.getData();
  }
}
