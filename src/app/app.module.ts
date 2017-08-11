import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ResourceProvider } from '../providers/resource/resource';
import {SharedModule} from "../components/shared.module";
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';
import { HttpModule } from '@angular/http';
import { BackgroundMode } from '@ionic-native/background-mode';
import { IonicStorageModule } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version';
import {HttpClientProvider} from "../providers/http-client/http-client";
import {UserProvider} from "../providers/user/user";
import {NetworkAvailabilityProvider} from "../providers/network-availability/network-availability";
import {AppProvider} from "../providers/app/app";
import {VisualizerService} from "../providers/visualizer-service";
import {DashboardServiceProvider} from "../providers/dashboard-service/dashboard-service";
import {DashboardModule} from "../components/dashboard.module";
import { AboutProvider } from '../providers/about/about';
import { ProfileProvider } from '../providers/profile/profile';
import { DashboardProvider } from '../providers/dashboard/dashboard';
import { AnalyticsServiceProvider } from '../providers/analytics-service/analytics-service';
import { ChartServiceProvider } from '../providers/chart-service/chart-service';
import { ColorInterpolationServiceProvider } from '../providers/color-interpolation-service/color-interpolation-service';
import { DashboardNotificationServiceProvider } from '../providers/dashboard-notification-service/dashboard-notification-service';
import { FavoriteServiceProvider } from '../providers/favorite-service/favorite-service';
import { GeoFeatureServiceProvider } from '../providers/geo-feature-service/geo-feature-service';
import { LegendSetServiceProvider } from '../providers/legend-set-service/legend-set-service';
import { MapServiceProvider } from '../providers/map-service/map-service';
import { MapVisualizationServiceProvider } from '../providers/map-visualization-service/map-visualization-service';
import { OrgUnitGroupSetServiceProvider } from '../providers/org-unit-group-set-service/org-unit-group-set-service';
import { RelativePeriodServiceProvider } from '../providers/relative-period-service/relative-period-service';
import { TableServiceProvider } from '../providers/table-service/table-service';
import { VisualizationServiceProvider } from '../providers/visualization-service/visualization-service';
import { VisualizationObjectServiceProvider } from '../providers/visualization-object-service/visualization-object-service';
import { VisualizerServiceProvider } from '../providers/visualizer-service/visualizer-service';
import { UtilitiesServiceProvider } from '../providers/utilities-service/utilities-service';
import { MapFilesConversionProvider } from '../providers/map-files-conversion/map-files-conversion';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    SharedModule,DashboardModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,HTTP,AppVersion,Network,BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ResourceProvider,HttpClientProvider,UserProvider,NetworkAvailabilityProvider,AppProvider,
    VisualizerService,DashboardServiceProvider,
    AboutProvider,
    ProfileProvider,
    DashboardProvider,
    AnalyticsServiceProvider,
    ChartServiceProvider,
    ColorInterpolationServiceProvider,
    DashboardNotificationServiceProvider,
    FavoriteServiceProvider,
    GeoFeatureServiceProvider,
    LegendSetServiceProvider,
    MapServiceProvider,
    MapVisualizationServiceProvider,
    OrgUnitGroupSetServiceProvider,
    RelativePeriodServiceProvider,
    TableServiceProvider,
    VisualizationServiceProvider,
    VisualizationObjectServiceProvider,
    VisualizerServiceProvider,
    UtilitiesServiceProvider,
    MapFilesConversionProvider,
  ]
})
export class AppModule {}
