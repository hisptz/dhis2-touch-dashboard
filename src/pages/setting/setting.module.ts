import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingPage } from './setting';
import { TranslateModule } from '@ngx-translate/core';
import { sharedComponentsModule } from '../../components/sharedComponents.module';

@NgModule({
  declarations: [SettingPage],
  imports: [
    IonicPageModule.forChild(SettingPage),
    sharedComponentsModule,
    TranslateModule.forChild()
  ]
})
export class SettingPageModule {}
