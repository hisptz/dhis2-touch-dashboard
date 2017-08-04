import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DashboardCardComponent } from './dashboard-card/dashboard-card';
import {ChartCardComponent} from "./chart-card/chart-card";
import {TableCardComponent} from "./table-card/table-card";
import {SharedModule} from "./shared.module";
import {VisualizationCardComponent} from "./visualization-card/visualization-card";

@NgModule({
  declarations: [
    DashboardCardComponent,ChartCardComponent,
    TableCardComponent,VisualizationCardComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [DashboardCardComponent,ChartCardComponent,
    TableCardComponent,VisualizationCardComponent ]
})

export class DashboardModule { }
