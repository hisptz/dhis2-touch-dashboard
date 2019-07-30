/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
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
    platform.ready().then(() => {
      this.logoUrl = 'assets/img/logo.png';
      this.logOutIcon = 'assets/img/logo.png';
      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'Dashboard', component: 'DashboardPage', icon: 'home' },
        { title: 'Profile', component: 'ProfilePage', icon: 'person' },
        { title: 'About', component: 'AboutPage', icon: 'information-circle' },
        { title: 'Settings', component: 'SettingsPage', icon: 'construct' }
      ];
      this.initializeApp();
    });
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
