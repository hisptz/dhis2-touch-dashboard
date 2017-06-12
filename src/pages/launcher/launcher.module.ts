import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LauncherPage } from './launcher';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    LauncherPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(LauncherPage),
  ],
  exports: [
    LauncherPage
  ]
})
export class LauncherPageModule {}
