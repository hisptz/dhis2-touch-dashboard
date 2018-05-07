export interface VisualizationDataSelection {
  dimension: string;
  filter?: string;
  layout?: string;
  items: Array<{
    id: string;
    name: string;
    type: string;
  }>
}
