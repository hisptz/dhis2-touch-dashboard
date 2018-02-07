import {NgModule} from '@angular/core';
import {IonicModule} from "ionic-angular";
import {VisualizationTypesSectionComponent} from "./visualization-types-section/visualization-types-section.component";

@NgModule({
  declarations: [VisualizationTypesSectionComponent],
  imports: [IonicModule],
  exports: [VisualizationTypesSectionComponent]

})
export class DashboardModule {
}
