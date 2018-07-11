import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingPage } from './setting';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  declarations: [SettingPage],
  imports: [
    IonicPageModule.forChild(SettingPage),
    SharedModule,
    TranslateModule.forChild()
  ]
})
export class SettingPageModule {}
