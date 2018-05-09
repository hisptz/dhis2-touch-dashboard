export interface VisualizationDataSelection {
  dimension: string;
  layout?: string;
  filter?: string;
  items: Array<{
    id: string;
    name: string;
    type: string;
    optionSet?: any;
  }>
}
