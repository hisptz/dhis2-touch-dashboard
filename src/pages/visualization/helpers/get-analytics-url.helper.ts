import * as _ from 'lodash';
import { VisualizationDataSelection } from '../models/visualization-data-selection.model';

// TODO Find best standard for config structure so that layerType can be obtained direct from config object
export function getAnalyticsUrl(dataSelections: VisualizationDataSelection[], layerType: string,
  config?: any): string {
  return layerType === 'thematic' ? getAggregateAnalyticsUrl(dataSelections, layerType, config) :
    getEventAnalyticsUrl(dataSelections, layerType, config);
}

function flattenDimensions(dataSelections: VisualizationDataSelection[]): string {
  return _.map(dataSelections, (dataSelection: VisualizationDataSelection) => {
    const selectionValues = _.map(dataSelection.items, item => item.id).join(';');
    return selectionValues !== '' ? 'dimension=' + dataSelection.dimension + ':' + selectionValues : '';
  }).join('&');
}

function getAggregateAnalyticsUrl(dataSelections: VisualizationDataSelection[], layerType: string,
  config?: any): string {
  const flattenedDimensionString = flattenDimensions(dataSelections);
  return flattenedDimensionString !== '' ?
    'analytics.json?' + flattenedDimensionString + getAnalyticsUrlOptions(config, layerType) : '';
}

function getAnalyticsUrlOptions(config: any, layerType: string) {
  if (!config && !layerType) {
    return '';
  }

  const displayPropertySection = config.displayNameProperty ? '&displayProperty=' + config.displayNameProperty : '';

  const aggregrationTypeSection = config ?
    config.aggregationType && config.aggregationType !== 'DEFAULT' ? '&aggregationType=' + config.aggregationType : '' :
    '';

  const valueSection = config.value ? '&value' + config.value.id : '';

  const outputType = layerType === 'event' ? '&outputType=EVENT' : '';

  const coordinateSection = layerType === 'event' ? '&coordinatesOnly=true' : '';

  return displayPropertySection + aggregrationTypeSection + valueSection + outputType + coordinateSection;
}

function getEventAnalyticsUrl(dataSelections: VisualizationDataSelection[], layerType: string, config: any) {
  const analyticsUrlFields = getProgramParameters(config) + getEventAnalyticsUrlSection(
    config) + getEventAnalyticsStartAndEndDateSection(config) + flattenDimensions(
    dataSelections) + getAnalyticsUrlOptions(config, layerType);
  return analyticsUrlFields !== '' ? 'analytics/events/' + analyticsUrlFields : '';
}

function getProgramParameters(config: any): string {
  return config ? config.program && config.programStage ? config.program.id && config.programStage.id ?
    config.program.id + '.json?stage=' + config.programStage.id + '&' : '' : '' : '';
}

function getEventAnalyticsUrlSection(config) {
  return config && (config.dataType || config.aggregate || config.eventClustering) ?
    (config.dataType !== 'AGGREGATED_VALUES' || !config.aggregate) ? config.eventClustering ? 'count/' : 'query/' :
      'aggregate/' : '';
}

function getEventAnalyticsStartAndEndDateSection(config: any) {
  return config && config.startDate && config.endDate ?
    'startDate=' + config.startDate + '&' + 'endDate=' + config.endDate + '&' : '';
}
