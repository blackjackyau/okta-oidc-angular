import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthProfile, FederatedIdP } from './auth-profiles.model';
import { AuthProfilesService } from './auth-profiles.service';

@Component({
  selector: 'app-auth-profiles',
  templateUrl: './auth-profiles.component.html',
  styleUrls: ['./auth-profiles.component.scss']
})
export class AuthProfilesComponent implements OnInit {

  profileForm: FormGroup;
  federatedIdps: FormArray;

  constructor(private authProfilesService: AuthProfilesService, formBuilder: FormBuilder) {
    this.federatedIdps = new FormArray([]);
    this.profileForm = formBuilder.group({
      clientId: ['', Validators.required],
      issuer: ['', Validators.required],
      scope: ['openid profile email', Validators.required],
      federatedIdps: this.federatedIdps
    });    
  }

  ngOnInit(): void {
    
  }

  addFederatedIdp($event) {
    const federatedIdpGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      id: new FormControl('', Validators.required)
    });

    this.federatedIdps.push(federatedIdpGroup);
    $event.stopPropagation();
  }

  removeFederatedIdp(index: number) {
    this.federatedIdps.removeAt(index);
  }

  addProfile() {
    if (this.profileForm.valid) {
      const fedIdps: FederatedIdP[] = [];
      for (let value of this.federatedIdps.value) {
          fedIdps.push(value);
     }
     const profiles = this.authProfilesService.list();
      const profile: AuthProfile = {
        oktaUrl: undefined,
        oidc: {
          clientId: this.profileForm.get("clientId").value,
          issuer: this.profileForm.get("issuer").value,
          scope: this.profileForm.get("scope").value,
        },
        federatedIdps: fedIdps
      };
      profiles.push(profile);
      this.authProfilesService.save(profiles);
    }
  }






}
