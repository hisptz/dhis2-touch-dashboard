import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import {
  getVisualizationObjectEntities,
  getVisualizationLayerEntities,
  getVisualizationUiConfigurationEntities
} from '../reducers';
import { Visualization } from '../../models/visualization.model';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';

export const getCurrentVisualizationObjectLayers = (visualizationId: string) => createSelector(
  getVisualizationObjectEntities, getVisualizationLayerEntities, getVisualizationUiConfigurationEntities,
  (visualizationObjectEntities, visualizationLayerEntities, visualizationUiConfigurationEntities) => {
    const currentVisualizationObject: Visualization = visualizationObjectEntities[visualizationId];
    if (!currentVisualizationObject) {
      return [];
    }

    const currentVisualizationUiConfiguration: VisualizationUiConfig = visualizationUiConfigurationEntities[currentVisualizationObject.uiConfigId];
    return currentVisualizationUiConfiguration.showBody ? _.filter(_.map(currentVisualizationObject.layers, layer => visualizationLayerEntities[layer]),
      layer => layer): [];
  });
