import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DashboardCardComponent } from './dashboard-card/dashboard-card';
import {TableCardComponent} from "./table-card/table-card";
import {SharedModule} from "./shared.module";
import {ChartComponent} from "./chart/chart";
import {ChartTemplateComponent} from "./chart-template/chart-template";
import { MapComponent } from './map/map';
import { MapTemplateComponent } from './map-template/map-template';
import { AppComponent } from './app/app';
import { UsersComponent } from './users/users';
import { ResourcesComponent } from './resources/resources';
import { MessagesComponent } from './messages/messages';
import { ReportsComponent } from './reports/reports';

@NgModule({
  declarations: [DashboardCardComponent,
    ChartComponent,ChartTemplateComponent,
    MapComponent,MapTemplateComponent,
    TableCardComponent,UsersComponent,
    ResourcesComponent,AppComponent,
    MessagesComponent,
    ReportsComponent ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [DashboardCardComponent,
    ChartComponent,ChartTemplateComponent,
    MapComponent,MapTemplateComponent,
    TableCardComponent,UsersComponent,
    ResourcesComponent,AppComponent,
    MessagesComponent,
    ReportsComponent ]
})

export class DashboardModule { }
