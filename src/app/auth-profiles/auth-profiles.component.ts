import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthProfile, AuthProfileData, FederatedIdP } from './auth-profiles.model';
import { AuthProfilesService } from './auth-profiles.service';

@Component({
  selector: 'app-auth-profiles',
  templateUrl: './auth-profiles.component.html',
  styleUrls: ['./auth-profiles.component.scss']
})
export class AuthProfilesComponent implements OnInit {

  profileForm: FormGroup;
  federatedIdps: FormArray;
  profileData: AuthProfileData;

  constructor(private authProfilesService: AuthProfilesService, formBuilder: FormBuilder) {
    this.federatedIdps = new FormArray([]);
    this.profileForm = formBuilder.group({
      name: ['', Validators.required],
      clientId: ['', Validators.required],
      issuer: ['', Validators.required],
      scope: ['openid profile email', Validators.required],
      federatedIdps: this.federatedIdps
    });
    this.profileData = this.authProfilesService.getData();
  }

  ngOnInit(): void {
    
  }

  addFederatedIdp($event) {
    const federatedIdpGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      id: new FormControl('', Validators.required)
    });

    this.federatedIdps.push(federatedIdpGroup);
    $event.preventDefault(); // do not propagate validation
  }

  removeFederatedIdp(index: number) {
    this.federatedIdps.removeAt(index);
  }

  select(profileIndex: number) {
    const profileData = this.authProfilesService.getData();
    profileData.selected = profileIndex;
    this.authProfilesService.save(profileData);
  }

  delete(profileIndex: number) {
    const profileData = this.authProfilesService.getData();
    profileData.profiles.splice(profileIndex ,1);
    this.authProfilesService.save(profileData);
    this.profileData = profileData;
  }

  addProfile() {
    if (this.profileForm.valid) {
      const fedIdps: FederatedIdP[] = [];
      for (let value of this.federatedIdps.value) {
          fedIdps.push(value);
     }
     const profileData = this.authProfilesService.getData();
      const profile: AuthProfile = {
        oktaUrl: undefined,
        name: this.profileForm.get("name").value,
        oidc: {
          clientId: this.profileForm.get("clientId").value,
          issuer: this.profileForm.get("issuer").value,
          scope: this.profileForm.get("scope").value,
        },
        federatedIdps: fedIdps
      };
      profileData.profiles.push(profile);
      this.authProfilesService.save(profileData);
      this.profileData = this.authProfilesService.getData();
      this.federatedIdps.clear();
      this.profileForm.reset();
    }
  }






}
