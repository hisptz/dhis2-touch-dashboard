import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LauncherPage} from "../pages/launcher/launcher";
import {DashBoardHomePage} from "../pages/dash-board-home/dash-board-home";
import {LoginPage} from "../pages/login/login";
import {User} from "../providers/user";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LauncherPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,public user : User, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Dashboards', component: DashBoardHomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#2161A5");
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logOut(){
    this.user.getCurrentUser().then((user :any)=>{
      user.isLogin = false;
      this.user.setCurrentUser(user).then(user=>{
        this.nav.setRoot(LoginPage);
      })
    })
  }
}
