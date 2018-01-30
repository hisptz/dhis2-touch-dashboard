import {Component, OnInit} from '@angular/core';
import {IonicPage, MenuController, NavController } from 'ionic-angular';
import {ApplicationState} from "../../store/reducers/index";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {CurrentUser} from "../../models/currentUser";
import {getCurrentUser} from "../../store/selectors/currentUser.selectors";

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit{

  currentUser$ : Observable<CurrentUser>;

  constructor(public navCtrl: NavController,
              private store : Store<ApplicationState>,
              private menu : MenuController) {
  }

  ngOnInit(){
    this.menu.enable(true);
    this.currentUser$ = this.store.select(getCurrentUser);
  }

}
