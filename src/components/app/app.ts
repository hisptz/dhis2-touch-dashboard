import { Component } from '@angular/core';

/**
 * Generated class for the AppComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app',
  templateUrl: 'app.html'
})
export class AppComponent {

  text: string;

  constructor() {
    this.text = 'App list';
  }

}
