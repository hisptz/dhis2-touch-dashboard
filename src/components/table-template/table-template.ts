import { Component } from '@angular/core';

/**
 * Generated class for the TableTemplateComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'table-template',
  templateUrl: 'table-template.html'
})
export class TableTemplateComponent {

  text: string;

  constructor() {
    console.log('Hello TableTemplateComponent Component');
    this.text = 'Hello World';
  }

}
