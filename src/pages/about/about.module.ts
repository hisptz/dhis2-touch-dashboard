import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AboutPage } from "./about";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../components/share.module";

@NgModule({
  declarations: [AboutPage],
  imports: [
    IonicPageModule.forChild(AboutPage),
    SharedModule,
    TranslateModule.forChild()
  ]
})
export class AboutPageModule {}
