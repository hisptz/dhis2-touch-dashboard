import { VisualizationConfig } from '../models/visualization-config.model';
export function getStandardizedVisualizationConfig(visualizationItem: any): VisualizationConfig{
  return {
    id: `${visualizationItem.id}_config`,
    currentType: ''
  }
}
