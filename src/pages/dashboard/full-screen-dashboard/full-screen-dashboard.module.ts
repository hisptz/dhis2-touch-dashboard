import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FullScreenDashboardPage } from './full-screen-dashboard';
import {ChartModule} from "../../../modules/chart/chart.module";
import {TableModule} from "../../../modules/table/table.module";
import {MapModule} from "../../../modules/map/map.module";
import {InterpretationModule} from "../../../modules/interpretation/interpretation.module";
import {SharedModule} from "../../../components/share.module";
import {DashboardModule} from "../components/dashboard.module";
import {DictionaryModule} from "../../../modules/dictionary/dictionary.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    FullScreenDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(FullScreenDashboardPage),
    ChartModule,
    TableModule,
    MapModule,
    InterpretationModule,
    SharedModule,
    DashboardModule,
    DictionaryModule,
    TranslateModule.forChild()
  ],
})
export class FullScreenDashboardPageModule {}
