import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DashboardCardComponent } from './dashboard-card/dashboard-card';
import {TableCardComponent} from "./table-card/table-card";
import {SharedModule} from "./shared.module";
import {ChartComponent} from "./chart/chart";
import {ChartTemplateComponent} from "./chart-template/chart-template";

@NgModule({
  declarations: [DashboardCardComponent,
    ChartComponent,ChartTemplateComponent,
    TableCardComponent ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [DashboardCardComponent,
    ChartComponent,ChartTemplateComponent,
    TableCardComponent ]
})

export class DashboardModule { }
