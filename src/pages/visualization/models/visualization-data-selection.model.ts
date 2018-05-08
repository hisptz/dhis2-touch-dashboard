export interface VisualizationDataSelection {
  dimension: string;
  layout?: string;
  items: Array<{
    id: string;
    name: string;
    type: string;
  }>
}
