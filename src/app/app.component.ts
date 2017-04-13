import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LauncherPage} from "../pages/launcher/launcher";
import {LoginPage} from "../pages/login/login";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {User} from "../providers/user";
import {AboutPage} from "../pages/about/about";
import {ProfilePage} from "../pages/profile/profile";
import {SqlLite} from "../providers/sql-lite";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LauncherPage;

  pages: Array<{title: string, component: any,icon :string}>;

  constructor(public platform: Platform,public user : User,
              public SqlLite : SqlLite,
              public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    this.pages = [
      { title: 'Dashboards', component: DashboardPage ,icon : "pie"},
      { title: 'Profile', component: ProfilePage, icon : "person"},
      { title: 'About', component: AboutPage, icon : "information-circle"}
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
      this.SqlLite.dropTable("organisationUnits",user.currentDatabase).then(()=>{
      },error=>{});
      user.isLogin = false;
      this.user.setCurrentUser(user).then(user=>{
        this.nav.setRoot(LoginPage);
      })
    })
  }
}
