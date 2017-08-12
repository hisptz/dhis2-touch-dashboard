import { Component } from '@angular/core';

/**
 * Generated class for the ReportsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'reports',
  templateUrl: 'reports.html'
})
export class ReportsComponent {

  text: string;

  constructor() {
    this.text = 'Report list';
  }

}
