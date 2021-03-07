import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminsRoutingModule } from './admins-routing.module';
import { AdminsComponent } from './admins.component';
import { reducer } from './user-mgmt/reducers/user-mgmt.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UsersEffects } from './user-mgmt/effects/user-mgmt.effect';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { AppMaterialModule } from '../app-material.module';
import { AppSharedModule } from '../app-shared.module';


@NgModule({
  declarations: [AdminsComponent, UserMgmtComponent],
  imports: [
    CommonModule,
    AdminsRoutingModule,
    AppMaterialModule,
    AppSharedModule,
    StoreModule.forFeature('userMgmt', reducer),
    EffectsModule.forFeature([UsersEffects])
  ]
})
export class AdminsModule { }
