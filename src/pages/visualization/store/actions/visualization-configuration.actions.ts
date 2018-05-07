import { Action } from '@ngrx/store';
import { VisualizationConfig } from '../../models/visualization-config.model';

export enum VisualizationConfigurationActionTypes {
  ADD_VISUALIZATION_CONFIGURATION = '[VisualizationConfig] Add visualization configuration',
  UPDATE_VISUALIZATION_TYPE = '[VisualizationConfig] Update visualization type'
}

export class AddVisualizationConfigurationAction implements Action {
  readonly type = VisualizationConfigurationActionTypes.ADD_VISUALIZATION_CONFIGURATION;
  constructor(public visualizationConfiguration: VisualizationConfig) {}
}

export class UpdateVisualizationTypeAction implements Action {
  readonly type = VisualizationConfigurationActionTypes.UPDATE_VISUALIZATION_TYPE;
  constructor(public id: string, public changes: Partial<VisualizationConfig>) {}
}

export type VisualizationConfigurationAction = AddVisualizationConfigurationAction | UpdateVisualizationTypeAction;
