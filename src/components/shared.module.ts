import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ProgressBarPage } from './progress-bar/progress-bar';
import { LoadingPage } from './loading/loading';
import {VisualizationCardPage} from "./visualization-card/visualization-card";
import { ChartModule } from 'angular2-highcharts';

@NgModule({
  declarations: [
    LoadingPage,
    ProgressBarPage,
    VisualizationCardPage,
  ],
  imports: [
    IonicModule,ChartModule
  ],
  exports: [
    LoadingPage,
    ProgressBarPage,
    VisualizationCardPage
  ]
})

export class SharedModule { }
