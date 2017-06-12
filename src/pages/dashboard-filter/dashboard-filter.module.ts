import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardFilterPage } from './dashboard-filter';

@NgModule({
  declarations: [
    DashboardFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardFilterPage),
  ],
  exports: [
    DashboardFilterPage
  ]
})
export class DashboardFilterPageModule {}
