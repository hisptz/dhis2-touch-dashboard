import { Component, Input } from '@angular/core';

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
export class SelectionFiltersComponent {

  showFilters: boolean;
  selectedFilter: string;
  constructor() {
    this.showFilters = false;
    this.selectedFilter = 'DATA'
  }

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
  }

  setCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    this.selectedFilter = selectedFilter;
  }

}
