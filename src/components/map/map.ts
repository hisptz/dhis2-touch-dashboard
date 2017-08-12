import { Component } from '@angular/core';

/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  text: string;

  constructor() {
    console.log('Hello MapComponent Component');
    this.text = 'Hello World';
  }

}
