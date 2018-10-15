import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { CurrentUser } from '../models/current-user';

import { Store } from '@ngrx/store';
import { State, ClearCurrentUser } from '../store';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;
  rootPage: any;
  pages: Array<{ title: string; component: any; icon: string }>;
  logoUrl: string;
  logOutIcon: string;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private userProvider: UserProvider,
    private store: Store<State>
  ) {
    this.logoUrl = 'assets/img/logo.png';
    this.logOutIcon = 'assets/img/logo.png';
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Dashboard', component: 'DashboardPage', icon: 'home' },
      { title: 'About', component: 'AboutPage', icon: 'information-circle' },
      { title: 'Settings', component: 'SettingPage', icon: 'construct' }
    ];
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.rootPage = 'LaunchPage';
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logOut() {
    this.nav.setRoot('LoginPage');
    this.store.dispatch(new ClearCurrentUser());
    this.userProvider.getCurrentUser().subscribe((currentUser: CurrentUser) => {
      if (currentUser && currentUser.username) {
        currentUser.isLogin = false;
        this.userProvider.setCurrentUser(currentUser).subscribe(() => {});
      }
    });
  }
}
