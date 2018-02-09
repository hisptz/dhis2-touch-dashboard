import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { TranslateModule } from '@ngx-translate/core';

import { ChartModule } from '../../modules/chart/chart.module';
import { TableModule } from '../../modules/table/table.module';
import { DashboardModule } from './components/dashboard.module';
import { InterpretationModule } from './../../modules/interpretation/interpretation.module';
import { MapModule } from './../../modules/map/map.module';
import { DictionaryModule } from './../../modules/dictionary/dictionary.module';
import { SharedModule } from '../../components/share.module';
import {DataFilterModule} from "../../modules/data-filter/data-filter.module";
import {LayoutModule} from "../../modules/layout/layout.module";
import {OrgUnitFilterModule} from "../../modules/org-unit-filter/org-unit-filter.module";
import {PeriodFilterModule} from "../../modules/period-filter/period-filter.module";

@NgModule({
  declarations: [DashboardPage],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    ChartModule,
    TableModule,
    MapModule,
    InterpretationModule,
    SharedModule,
    DashboardModule,
    DictionaryModule,
    DataFilterModule,
    LayoutModule,
    OrgUnitFilterModule,
    PeriodFilterModule,
    TranslateModule.forChild()
  ]
})
export class DashboardPageModule {}
