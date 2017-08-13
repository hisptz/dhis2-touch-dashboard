import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DashboardCardComponent } from './dashboard-card/dashboard-card';
import {TableCardComponent} from "./table-card/table-card";
import {SharedModule} from "./shared.module";
import {ChartComponent} from "./chart/chart";
import {ChartTemplateComponent} from "./chart-template/chart-template";
import { MapTemplateComponent } from './map-template/map-template';
import { AppComponent } from './app/app';
import { UsersComponent } from './users/users';
import { ResourcesComponent } from './resources/resources';
import { MessagesComponent } from './messages/messages';
import { ReportsComponent } from './reports/reports';
import { VisualizationLegendComponent } from './visualization-legend/visualization-legend';
import {SafePipe} from "./safe.pipe";

@NgModule({
  declarations: [DashboardCardComponent,
    ChartComponent,ChartTemplateComponent,MapTemplateComponent,
    TableCardComponent,UsersComponent,
    ResourcesComponent,AppComponent,
    VisualizationLegendComponent,
    MessagesComponent,SafePipe,
    ReportsComponent ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [DashboardCardComponent,
    ChartComponent,ChartTemplateComponent,MapTemplateComponent,
    TableCardComponent,UsersComponent,
    ResourcesComponent,AppComponent,
    VisualizationLegendComponent,
    MessagesComponent,SafePipe,
    ReportsComponent ]
})

export class DashboardModule { }
