import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardListFilterPage } from './dashboard-list-filter';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    DashboardListFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardListFilterPage),
    PipesModule
  ],
})
export class DashboardListFilterPageModule {}
