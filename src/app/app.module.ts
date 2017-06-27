import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { BackgroundMode } from '@ionic-native/background-mode';
import { AppVersion } from '@ionic-native/app-version';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { ChartModule } from 'angular2-highcharts';
import { SQLite } from '@ionic-native/sqlite';
import { AppProvider } from '../providers/app/app';
import { HttpClientProvider } from '../providers/http-client/http-client';
import { DashboardServiceProvider } from '../providers/dashboard-service/dashboard-service';
import { NetworkAvailabilityProvider } from '../providers/network-availability/network-availability';
import {VisualizerService } from '../providers/visualizer-service';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    ChartModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,SQLite,Network,
    BackgroundMode,AppVersion,HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    AppProvider,
    HttpClientProvider,
    DashboardServiceProvider,
    NetworkAvailabilityProvider,
    VisualizerService
  ]
})
export class AppModule {}
