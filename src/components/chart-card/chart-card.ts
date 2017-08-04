import { Component } from '@angular/core';

/**
 * Generated class for the ChartCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'chart-card',
  templateUrl: 'chart-card.html'
})
export class ChartCardComponent {

  text: string;

  constructor() {
    console.log('Hello ChartCardComponent Component');
    this.text = 'Hello World ** chart-card';
  }

}
