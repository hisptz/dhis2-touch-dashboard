import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// core services and native plugins
import { appProviders, nativePlugins } from '../providers';

//store
import { reducers, effects, metaReducers } from '../store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Multi-language
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { PipesModule } from '../pipes/pipes.module';
import { sharedComponentsModule } from '../components/sharedComponents.module';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false }),
    HttpClientModule,
    TranslateModule.forRoot(),
    PipesModule,
    sharedComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    HttpClient,
    {
      provide: TranslateLoader,
      useFactory: (http: HttpClient) =>
        new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
      deps: [HttpClient]
    },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ...appProviders,
    ...nativePlugins
  ]
})
export class AppModule {}
