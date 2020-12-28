import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
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

  constructor(private authProfilesService: AuthProfilesService, formBuilder: FormBuilder,
    public dialog: MatDialog) {
    this.federatedIdps = new FormArray([]);
    this.profileForm = formBuilder.group({
      oktaUrl: [''],
      name: ['', Validators.required],
      clientId: ['', Validators.required],
      issuer: ['', Validators.required],
      scope: ['openid profile email', Validators.required],
      fedIdPKey: ['idp', Validators.required],
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

  select(authProfile: AuthProfile) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {title: "Confirmation", body: "Select this profile ?", callback: ()=> {
        const profileData = this.authProfilesService.getData();
        profileData.selected = authProfile.id;
        this.authProfilesService.save(profileData);
        this.profileData = profileData;
        dialogRef.close();
      }}
    });
  }

  delete(profileIndex: number, authProfile: AuthProfile) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {title: "Confirmation", body: "Delete this profile ?", callback: ()=> {
        const profileData = this.authProfilesService.getData();
        profileData.profiles.splice(profileIndex, 1);
        if (authProfile.id === profileData.selected) {
          profileData.selected = undefined;
        }
        this.authProfilesService.save(profileData);
        this.profileData = profileData;
        dialogRef.close();
      }}
    });
  }

  addProfile() {
    if (this.profileForm.valid) {
      const fedIdps: FederatedIdP[] = [];
      for (let value of this.federatedIdps.value) {
        fedIdps.push(value);
      }
      const profileData = this.authProfilesService.getData();
      const profile: AuthProfile = {
        id: this.uuidv4(),
        oktaUrl: this.profileForm.get("oktaUrl").value,
        name: this.profileForm.get("name").value,
        oidc: {
          clientId: this.profileForm.get("clientId").value,
          issuer: this.profileForm.get("issuer").value,
          scope: this.profileForm.get("scope").value,
        },
        fedIdPKey: this.profileForm.get("fedIdPKey").value,
        federatedIdps: fedIdps
      };
      profileData.profiles.push(profile);
      this.authProfilesService.save(profileData);
      this.profileData = this.authProfilesService.getData();
      this.federatedIdps.clear();
      this.profileForm.reset({ scope: "openid profile email", fedIdPKey: "idp" });
    }
  }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }





}
