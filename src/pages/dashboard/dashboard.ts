import {Component, OnInit} from '@angular/core';
import {IonicPage, MenuController, NavController } from 'ionic-angular';
import {ApplicationState} from "../../store/reducers/index";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {CurrentUser} from "../../models/currentUser";
import {getCurrentUser} from "../../store/selectors/currentUser.selectors";
import {HttpClientProvider} from "../../providers/http-client/http-client";

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
              private http : HttpClientProvider,
              private menu : MenuController) {
  }

  ngOnInit(){
    this.menu.enable(true);
    this.currentUser$ = this.store.select(getCurrentUser);
    let smsCommandUrl = "dataStore/sms/commands";
    this.http.get(smsCommandUrl).subscribe((done : any)=>{
      console.log("Done : " + JSON.stringify(done.password));
    },error=>{
      console.log("error : " + JSON.stringify(error));
    })
  }

}
