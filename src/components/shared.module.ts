import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ProgressBarPage } from './progress-bar/progress-bar';
import { LoadingPage } from './loading/loading';
import {VisualizationCardPage} from "./visualization-card/visualization-card";
import { ChartModule } from 'angular2-highcharts';
import {EmptyListNotificationComponent} from "./empty-list-notification/empty-list-notification";

@NgModule({
  declarations: [
    LoadingPage,
    ProgressBarPage,
    EmptyListNotificationComponent,
    VisualizationCardPage,
  ],
  imports: [
    IonicModule,ChartModule
  ],
  exports: [
    LoadingPage,
    ProgressBarPage,
    VisualizationCardPage,
    EmptyListNotificationComponent
  ]
})

export class SharedModule { }
