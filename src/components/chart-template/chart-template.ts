import { Component } from '@angular/core';

/**
 * Generated class for the ChartTemplateComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'chart-template',
  templateUrl: 'chart-template.html'
})
export class ChartTemplateComponent {

  text: string;

  constructor() {
    console.log('Hello ChartTemplateComponent Component');
    this.text = 'Hello World';
  }

}
