import { Component } from '@angular/core';

/**
 * Generated class for the UsersComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'users',
  templateUrl: 'users.html'
})
export class UsersComponent {

  text: string;

  constructor() {
    this.text = 'Users list';
  }

}
