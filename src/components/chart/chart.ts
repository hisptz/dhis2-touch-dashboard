import { Component } from '@angular/core';

/**
 * Generated class for the ChartComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'chart',
  templateUrl: 'chart.html'
})
export class ChartComponent {

  text: string;

  constructor() {
    console.log('Hello ChartComponent Component');
    this.text = 'Hello World';
  }

}
