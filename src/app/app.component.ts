import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {UserProvider} from "../providers/user/user";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  logoUrl : string;

  pages: Array<{title: string, component: any,icon : string}>;

  constructor(public platform: Platform,
              private UserProvider : UserProvider,
              public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title : 'Dashboards',component : 'DashboardPage',icon : 'pie'},
      { title : "Profile",component : 'ProfilePage', icon : "contact"},
      {title : 'About', component :'AboutPage', icon : "information-circle"}
    ];
    this.logoUrl = 'assets/img/logo.png';
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.statusBar.backgroundColorByHexString("#387ef5");
      this.rootPage = 'LauncherPage';
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
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
