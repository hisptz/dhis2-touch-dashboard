import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FullScreenDashboardPage } from './full-screen-dashboard';

@NgModule({
  declarations: [
    FullScreenDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(FullScreenDashboardPage),
  ],
})
export class FullScreenDashboardPageModule {}
