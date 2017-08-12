import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DashboardCardComponent } from './dashboard-card/dashboard-card';
import {ChartCardComponent} from "./chart-card/chart-card";
import {TableCardComponent} from "./table-card/table-card";
import {SharedModule} from "./shared.module";
import {ChartComponent} from "./chart/chart";
import {ChartTemplateComponent} from "./chart-template/chart-template";
import {TableTemplateComponent} from "./table-template/table-template";
import {TableComponent} from "./table/table";

@NgModule({
  declarations: [DashboardCardComponent,ChartCardComponent,
    ChartComponent,ChartTemplateComponent,TableTemplateComponent,TableComponent,
    TableCardComponent ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [DashboardCardComponent,ChartCardComponent,
    ChartComponent,ChartTemplateComponent,TableTemplateComponent,TableComponent,
    TableCardComponent ]
})

export class DashboardModule { }
