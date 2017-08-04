import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DashboardCardComponent } from './dashboard-card/dashboard-card';
import {ChartCardComponent} from "./chart-card/chart-card";
import {TableCardComponent} from "./table-card/table-card";

@NgModule({
  declarations: [
    DashboardCardComponent,ChartCardComponent,
    TableCardComponent
  ],
  imports: [
    IonicModule
  ],
  exports: [DashboardCardComponent,ChartCardComponent,
    TableCardComponent ]
})

export class DashboardModule { }
