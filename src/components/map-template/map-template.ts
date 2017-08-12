import { Component } from '@angular/core';

/**
 * Generated class for the MapTemplateComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'map-template',
  templateUrl: 'map-template.html'
})
export class MapTemplateComponent {

  text: string;

  constructor() {
    console.log('Hello MapTemplateComponent Component');
    this.text = 'Hello World';
  }

}
