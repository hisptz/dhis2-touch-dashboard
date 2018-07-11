import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading/loading';
import { IonicModule } from 'ionic-angular';
import { WarningComponent } from './warning/warning';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { EmptyListNotificationComponent } from './empty-list-notification/empty-list-notification';
import { AvailableLocalInstanceComponent } from './available-local-instance/available-local-instance';
import { ProgressLoaderComponent } from './progress-loader/progress-loader.component';
import { LanguageTranslationSelectionComponent } from './language-translation-selection/language-translation-selection';
import { MultiOrganisationUnitComponent } from './multi-organisation-unit/multi-organisation-unit';
import { MultiOrganisationUnitTreeComponent } from './multi-organisation-unit-tree/multi-organisation-unit-tree';
@NgModule({
  declarations: [
    MultiOrganisationUnitComponent,
    MultiOrganisationUnitTreeComponent,
    LoadingComponent,
    ProgressLoaderComponent,
    LanguageTranslationSelectionComponent,
    ProgressBarComponent,
    EmptyListNotificationComponent,
    AvailableLocalInstanceComponent,
    WarningComponent
  ],
  imports: [IonicModule],
  exports: [
    LoadingComponent,
    ProgressLoaderComponent,
    LanguageTranslationSelectionComponent,
    ProgressBarComponent,
    EmptyListNotificationComponent,
    AvailableLocalInstanceComponent,
    WarningComponent,
    MultiOrganisationUnitComponent,
    MultiOrganisationUnitTreeComponent
  ]
})
export class SharedModule {}
