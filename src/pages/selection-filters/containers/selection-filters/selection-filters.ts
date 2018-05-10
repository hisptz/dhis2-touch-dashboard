import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { VisualizationDataSelection } from '../../../visualization/models/visualization-data-selection.model';

/**
 * Generated class for the SelectionFiltersComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'selection-filters',
  templateUrl: './selection-filters.html'
})
export class SelectionFiltersComponent implements OnInit {

  @Input() dataSelections: VisualizationDataSelection[];
  @Output() filterUpdate: EventEmitter<VisualizationDataSelection[]> = new EventEmitter<VisualizationDataSelection[]>();
  showFilters: boolean;
  selectedFilter: string;

  constructor() {
    this.showFilters = false;
    this.selectedFilter = 'DATA';
  }


  get selectedData(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'dx']);
    return dataObject ? dataObject.items : [];
  }

  ngOnInit() {

  }

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
  }

  setCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    this.selectedFilter = selectedFilter;
  }

  onFilterClose(selectedItems) {
    this.dataSelections = [...this.updateDataSelectionWithNewSelections(this.dataSelections, selectedItems)];
    this.selectedFilter = '';
    this.showFilters = false;
  }

  onFilterUpdate(selectedItems) {
    this.dataSelections = [...this.updateDataSelectionWithNewSelections(this.dataSelections, selectedItems)];
    this.filterUpdate.emit(this.dataSelections);
    this.selectedFilter = '';
    this.showFilters = false;
  }

  updateDataSelectionWithNewSelections(dataSelections: VisualizationDataSelection[],
    selectedObject: any): VisualizationDataSelection[] {
    const selectedDimension = _.find(dataSelections, ['dimension', selectedObject.dimension]);
    const selectedDimensionIndex = dataSelections.indexOf(selectedDimension);
    return selectedDimension ? [
      ...dataSelections.slice(0, selectedDimensionIndex),
      {...selectedDimension, ...selectedObject},
      ...dataSelections.slice(selectedDimensionIndex + 1)
    ] : dataSelections;
  }

}
