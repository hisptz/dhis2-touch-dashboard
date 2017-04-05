import { Component,OnInit } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';
import {User} from "../../providers/user";
import {LoginPage} from "../login/login";
import {DashboardPage} from "../dashboard/dashboard";
import {DashboardService} from "../../providers/dashboard-service";

/*
  Generated class for the Launcher page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-launcher',
  templateUrl: 'launcher.html'
})
export class LauncherPage implements OnInit{

  public logoUrl : string = "";

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              public DashboardService : DashboardService,
              public user : User) {}

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.logoUrl = 'assets/img/logo-2.png';
    this.user.getCurrentUser().then((user : any)=>{
      if(user && user.isLogin){
        this.menuCtrl.enable(true);
        this.DashboardService.resetDashboards();
        this.navCtrl.setRoot(DashboardPage);
      }else{
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

}
