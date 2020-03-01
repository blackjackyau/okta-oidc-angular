import { NgModule } from '@angular/core';
import { KeyMgmtComponent } from './key-mgmt/key-mgmt.component';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './app-material.module';

@NgModule({
  imports: [CommonModule, AppMaterialModule],
  declarations: [KeyMgmtComponent],
  exports: [KeyMgmtComponent]
})
export class AppSharedModule { }
