import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../components/share.module";

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    SharedModule,
    TranslateModule.forChild()
  ],
})
export class DashboardPageModule {}
