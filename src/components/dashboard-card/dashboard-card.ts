import { Component } from '@angular/core';

/**
 * Generated class for the DashboardCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'dashboard-card',
  templateUrl: 'dashboard-card.html'
})
export class DashboardCardComponent {

  text: string;

  constructor() {
    console.log('Hello DashboardCardComponent Component');
    this.text = 'Hello World - dashboard-card';
  }

}
