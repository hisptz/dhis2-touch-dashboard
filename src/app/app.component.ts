import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { LauncherPage } from "../pages/launcher/launcher";
import { UserProvider } from "../providers/user/user";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string; component: any; icon: string }>;
  logoUrl: string;
  logOutIcon: string;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private userProvider: UserProvider,
    private splashScreen: SplashScreen
  ) {
    this.initializeApp();
    this.logoUrl = "assets/img/logo.png";
    this.logOutIcon = "assets/img/logo.png";
    // used for an example of ngFor and navigation
    this.pages = [
      { title: "dashboard", component: "DashboardPage", icon: "home" },
      { title: "about", component: "AboutPage", icon: "information-circle" },
      { title: "settings", component: "SettingPage", icon: "construct" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.rootPage = LauncherPage;
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  async logOut() {
    try {
      this.userProvider.getCurrentUser().subscribe(user => {
        user.isLogin = false;
        this.userProvider.setCurrentUser(user).subscribe(() => {
          this.nav.setRoot("LoginPage");
        });
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }
}
