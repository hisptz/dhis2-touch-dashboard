import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';

/**
 * Generated class for the VisualizationHeaderSectionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'visualization-header-section',
  templateUrl: 'visualization-header-section.html'
})
export class VisualizationHeaderSectionComponent {

  @Input() id: string;
  @Input() uiConfigId: string;
  @Input() showFilters: boolean;
  @Input() fullScreen: boolean;

  @Output() fullScreenAction: EventEmitter<any> = new EventEmitter<any>();

  constructor() {

  }

  onFullScreenAction(id) {
    this.fullScreenAction.emit({id, uiConfigId: this.uiConfigId});
  }

}
