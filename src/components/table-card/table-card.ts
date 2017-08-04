import { Component } from '@angular/core';

/**
 * Generated class for the TableCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'table-card',
  templateUrl: 'table-card.html'
})
export class TableCardComponent {

  text: string;

  constructor() {
    console.log('Hello TableCardComponent Component');
    this.text = 'Hello World === table-card';
  }

}
