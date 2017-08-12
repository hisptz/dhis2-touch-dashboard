import { Component } from '@angular/core';

/**
 * Generated class for the ResourcesComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'resources',
  templateUrl: 'resources.html'
})
export class ResourcesComponent {

  text: string;

  constructor() {
    this.text = 'Resource list';
  }

}
