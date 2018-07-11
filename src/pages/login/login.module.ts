import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  declarations: [LoginPage],
  imports: [
    IonicPageModule.forChild(LoginPage),
    SharedModule,
    TranslateModule.forChild({})
  ]
})
export class LoginPageModule {}
