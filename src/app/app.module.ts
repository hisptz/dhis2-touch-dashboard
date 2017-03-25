import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { SQLite } from '@ionic-native/sqlite';
import { AppVersion } from '@ionic-native/app-version';
import { ChartModule } from 'angular2-highcharts';
import {VisualizerService} from "../providers/visualizer-service";
import {AppProvider} from "../providers/app-provider";
import {Dashboard} from "../providers/dashboard";
import {HttpClient} from "../providers/http-client";
import {MetadataDictionaryService} from "../providers/metadata-dictionary-service";
import {NetworkAvailability} from "../providers/network-availability";
import {User} from "../providers/user";
import {SqlLite} from "../providers/sql-lite";

import {LauncherPage} from "../pages/launcher/launcher";
import {LoadingPage} from "../pages/loading/loading";
import {MetadataDictionary} from "../pages/metadata-dictionary/metadata-dictionary";
import {ProgressBarPage} from "../pages/progress-bar/progress-bar";
import {VisualizationCardPage} from "../pages/visualization-card/visualization-card";
import {LoginPage} from "../pages/login/login";
import {DashBoardHomePage} from "../pages/dash-board-home/dash-board-home";
import {AboutPage} from "../pages/about/about";
import {ProfilePage} from "../pages/profile/profile";


@NgModule({
  declarations: [
    MyApp,
    LauncherPage,LoadingPage,MetadataDictionary,ProgressBarPage,VisualizationCardPage,
    LoginPage,DashBoardHomePage,AboutPage,ProfilePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ChartModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LauncherPage,LoadingPage,MetadataDictionary,ProgressBarPage,VisualizationCardPage,
    LoginPage,DashBoardHomePage,AboutPage,ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,SQLite,HTTP,AppVersion,
    AppProvider,Dashboard,HttpClient,MetadataDictionaryService,NetworkAvailability,User,VisualizerService,
    SqlLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
