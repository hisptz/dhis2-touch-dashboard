import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';
import { TranslateModule } from '@ngx-translate/core';
import { sharedComponentsModule } from '../../components/sharedComponents.module';

@NgModule({
  declarations: [AboutPage],
  imports: [
    IonicPageModule.forChild(AboutPage),
    sharedComponentsModule,
    TranslateModule.forChild()
  ]
})
export class AboutPageModule {}
