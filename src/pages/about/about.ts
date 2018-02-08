import { Component, OnInit } from "@angular/core";
import { IonicPage } from "ionic-angular";
import { AboutProvider } from "../../providers/about/about";
import { AppProvider } from "../../providers/app/app";
import { UserProvider } from "../../providers/user/user";

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-about",
  templateUrl: "about.html"
})
export class AboutPage implements OnInit {
  logoUrl: string;
  currentUser: any;
  appInformation: any;
  systemInfo: any;
  loadingMessage: string;
  isLoading: boolean = true;
  hasAllDataBeenLoaded: boolean = false;
  aboutContents: Array<any>;
  isAboutContentOpen: any = {};

  constructor(
    private appProvider: AppProvider,
    private aboutProvider: AboutProvider,
    private userProvider: UserProvider
  ) {}

  ngOnInit() {
    this.loadingMessage = "loading_app_information";
    this.isLoading = true;
    this.logoUrl = "assets/img/logo.png";
    this.aboutContents = this.aboutProvider.getAboutContentDetails();
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.loadAllData();
      },
      error => {
        this.isLoading = false;
        this.appProvider.setNormalNotification("Fail to load user information");
      }
    );
  }

  loadAllData() {
    this.hasAllDataBeenLoaded = false;
    this.aboutProvider.getAppInformation().subscribe(
      appInformation => {
        this.appInformation = appInformation;
        this.loadingMessage = "loading_system_information";
        this.aboutProvider.getSystemInformation().subscribe(
          systemInfo => {
            this.systemInfo = systemInfo;
            if (this.aboutContents.length > 0) {
              if (
                this.isAboutContentOpen &&
                !this.isAboutContentOpen[this.aboutContents[0].id]
              ) {
                this.toggleAboutContents(this.aboutContents[0]);
              }
            }
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            console.log(JSON.stringify(error));
            this.appProvider.setNormalNotification(
              "Fail to load system information"
            );
          }
        );
      },
      error => {
        this.isLoading = false;
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification("Fail to load app information");
      }
    );
  }

  ionViewDidEnter() {
    if (this.hasAllDataBeenLoaded) {
      this.loadAllData();
    }
  }

  toggleAboutContents(content) {
    if (content && content.id) {
      if (this.isAboutContentOpen[content.id]) {
        this.isAboutContentOpen[content.id] = false;
      } else {
        Object.keys(this.isAboutContentOpen).forEach(id => {
          this.isAboutContentOpen[id] = false;
        });
        this.isAboutContentOpen[content.id] = true;
      }
    }
  }
}
