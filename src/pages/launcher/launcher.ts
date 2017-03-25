import { Component,OnInit } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';
import {User} from "../../providers/user";
import {DashBoardHomePage} from "../dash-board-home/dash-board-home";
import {LoginPage} from "../login/login";

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
              public user : User) {}

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.logoUrl = 'assets/img/logo-2.png';
    this.user.getCurrentUser().then((user : any)=>{
      if(user && user.isLogin){
        this.navCtrl.setRoot(DashBoardHomePage);
      }else{
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

}
