import { Visualization } from '../models/visualization.model';
import * as _ from 'lodash';
import { checkIfVisualizationIsNonVisualizable } from './check-if-visualization-is-non-visualizable.helper';
import { getStandardizedVisualizationType } from './get-standardized-visualization-type.helper';

export function getStandardizedVisualizationObject(visualizationItem: any): Visualization {
  const isNonVisualizable = checkIfVisualizationIsNonVisualizable(visualizationItem.type);
  return {
    id: visualizationItem.id,
    name: getVisualizationName(visualizationItem),
    type: getStandardizedVisualizationType(visualizationItem.type),
    favorite: getFavoriteDetails(visualizationItem),
    created: visualizationItem.created,
    lastUpdated: visualizationItem.lastUpdated,
    progress: isNonVisualizable ? {
      statusCode: 200,
      statusText: 'OK',
      percent: 100,
      message: 'Loaded'
    } : null,
    uiConfigId: `${visualizationItem.id}_ui_config`,
    visualizationConfigId: `${visualizationItem.id}_config`,
    layers: []
  };
}

function getVisualizationName(visualizationItem: any) {
  if (!visualizationItem) {
    return null;
  }

  /**
   * Return the app key as name when visualization is an app
   */
  if (visualizationItem.type === 'APP') {
    return visualizationItem.appKey;
  }

  return visualizationItem.type &&
         visualizationItem.hasOwnProperty(_.camelCase(visualizationItem.type))
    ? _.isPlainObject(visualizationItem[_.camelCase(visualizationItem.type)])
           ? visualizationItem[_.camelCase(visualizationItem.type)].displayName
           : null
    : null;
}

function getFavoriteDetails(visualizationItem: any) {
  return visualizationItem.type &&
         visualizationItem.hasOwnProperty(_.camelCase(visualizationItem.type))
    ? {
      id: _.isPlainObject(
        visualizationItem[_.camelCase(visualizationItem.type)]
      )
        ? visualizationItem[_.camelCase(visualizationItem.type)].id
        : undefined,
      type: _.camelCase(visualizationItem.type)
    }
    : null;
}

function getLayerDetailsForNonVisualizableObject(visualizationItem) {
  return visualizationItem.type === 'USERS' ||
         visualizationItem.type === 'REPORTS' ||
         visualizationItem.type === 'RESOURCES'
    ? [{rows: visualizationItem[_.camelCase(visualizationItem.type)]}]
    : [];
}
