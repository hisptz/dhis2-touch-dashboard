import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

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

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ChartModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2
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
