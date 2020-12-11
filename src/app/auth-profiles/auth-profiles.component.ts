import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-profiles',
  templateUrl: './auth-profiles.component.html',
  styleUrls: ['./auth-profiles.component.scss']
})
export class AuthProfilesComponent implements OnInit {

  profileForm: FormGroup;
  federatedIdpFormArray: FormArray;

  constructor(formBuilder: FormBuilder) {
    this.federatedIdpFormArray = new FormArray([]);
    this.profileForm = formBuilder.group({
      clientId: ['', Validators.required],
      issuer: ['', Validators.required],
      scope: ['', Validators.required],
      federatedIdps: this.federatedIdpFormArray
    });
  }

  addFederatedIdp() {
    const federatedIdpGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      id: new FormControl('', Validators.required)
    });

    this.federatedIdpFormArray.push(federatedIdpGroup);
  }

  removeFederatedIdp(index: number) {
    this.federatedIdpFormArray.removeAt(index);
  }

  ngOnInit(): void {
    
  }




}
