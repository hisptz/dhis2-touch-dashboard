import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ResourceProvider} from "../providers/resource/resource";
import {UserProvider} from "../providers/user/user";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  logoUrl :string;
  logOutIcon : string;

  pages: Array<{title: string, component: any,icon : string}>;

  constructor(public platform: Platform, public statusBar: StatusBar,
              private  UserProvider : UserProvider,
              public splashScreen: SplashScreen,public ResourceProvider : ResourceProvider) {
    this.initializeApp();
    this.logoUrl = "assets/img/logo.png";
    var menuIcons = this.ResourceProvider.getSideMenuIcons();
    this.logOutIcon = menuIcons.logOut;
    this.pages = [
      { title: 'Dashboard', component: 'DashboardPage', icon : menuIcons.dashboard},
      { title: 'Profile', component: 'ProfilePage', icon : menuIcons.profile },
      { title: 'About', component: 'AboutPage', icon : menuIcons.about }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.rootPage = 'LauncherPage';
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  async logOut(){
    try{
      let user :any = await this.UserProvider.getCurrentUser();
      user.isLogin = false;
      this.UserProvider.setCurrentUser(user).then(()=>{
        this.nav.setRoot('LoginPage');
      })
    }catch (e){
      console.log(JSON.stringify(e));
    }
  }
}
