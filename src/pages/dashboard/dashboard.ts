import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit {
  constructor(private navCtrl: NavController, private menu: MenuController) {
    this.menu.enable(true);
  }
  ngOnInit() {}
}
