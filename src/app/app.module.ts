import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {LauncherPage} from "../pages/launcher/launcher";
import {SharedModule} from "../components/share.module";
import { NetworkAvailabilityProvider } from '../providers/network-availability/network-availability';
import {UserProvider} from "../providers/user/user";
import {SqlLiteProvider} from "../providers/sql-lite/sql-lite";
import {AppProvider} from "../providers/app/app";
import {LocalInstanceProvider} from "../providers/local-instance/local-instance";
import {HttpClientProvider} from "../providers/http-client/http-client";
import {AppTranslationProvider} from "../providers/app-translation/app-translation";
import {EncryptionProvider} from "../providers/encryption/encryption";
import {SettingsProvider} from "../providers/settings/settings";

import {SQLite} from "@ionic-native/sqlite";
import {HTTP} from "@ionic-native/http";
import {AppVersion} from "@ionic-native/app-version";
import {Network} from "@ionic-native/network";
import {BackgroundMode} from "@ionic-native/background-mode";
import {IonicStorageModule} from "@ionic/storage";
import {SMS} from "@ionic-native/sms";


//translations
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule, Http } from '@angular/http';
import {EffectsModule} from '@ngrx/effects';
import {reducers, effects} from '../store';
import {PipesModule} from '../pipes/pipes.module';
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    LauncherPage
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    PipesModule,
    SharedModule,
    //StoreDevtoolsModule.instrument({maxAge: 100})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LauncherPage
  ],
  providers: [
    StatusBar,SQLite,SMS,
    SplashScreen,HTTP,AppVersion,Network,BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NetworkAvailabilityProvider,UserProvider,
    SettingsProvider,
    SqlLiteProvider,AppProvider,EncryptionProvider,
    LocalInstanceProvider,HttpClientProvider,AppTranslationProvider,
  ]
})
export class AppModule {}
