import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { LocalInstanceProvider } from '../../providers/local-instance/local-instance';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage implements OnInit {
  isSettingContentOpen: any;
  settingContents: Array<any>;
  isLoading: boolean = false;
  settingObject: any;
  loadingMessage: string;
  currentUser: any;
  translationCodes: Array<any> = [];
  currentLanguage: string;
  localInstances: any;
  translationMapper: any;

  constructor(
    private settingsProvider: SettingsProvider,
    private appProvider: AppProvider,
    private localInstanceProvider: LocalInstanceProvider,
    private appTranslationProvider: AppTranslationProvider,
    private userProvider: UserProvider
  ) {}

  ngOnInit() {
    this.settingObject = {};
    this.translationCodes = this.appTranslationProvider.getSupportedTranslationObjects();
    this.isLoading = true;
    this.isSettingContentOpen = {};
    this.settingContents = this.settingsProvider.getSettingContentDetails();
    if (this.settingContents.length > 0) {
      this.toggleSettingContents(this.settingContents[0]);
    }
    this.translationMapper = {};
    this.appTranslationProvider
      .getTransalations(this.getValuesToTranslate())
      .subscribe(
        (data: any) => {
          this.translationMapper = data;
          this.loadingCurrentUserInformation();
        },
        error => {
          this.loadingCurrentUserInformation();
        }
      );
  }

  loadingCurrentUserInformation() {
    let key = 'Discovering current user information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.currentLanguage = currentUser.currentLanguage;
        key = 'Discovering available local instances';
        this.loadingMessage = this.translationMapper[key]
          ? this.translationMapper[key]
          : key;
        this.localInstanceProvider.getLocalInstances().subscribe(
          (instances: any) => {
            this.localInstances = instances;
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            this.appProvider.setNormalNotification(
              'Fail to load available local instances'
            );
          }
        );
      },
      error => {
        console.log(error);
        this.isLoading = false;
        this.appProvider.setNormalNotification(
          'Fail to load current user information'
        );
      }
    );
  }

  updateCurrentLanguage() {
    try {
      let loggedInInInstance = this.currentUser.serverUrl;
      if (this.currentUser.serverUrl.split('://').length > 1) {
        loggedInInInstance = this.currentUser.serverUrl.split('://')[1];
      }
      this.appTranslationProvider.setAppTranslation(this.currentLanguage);
      this.currentUser.currentLanguage = this.currentLanguage;
      this.userProvider.setCurrentUser(this.currentUser).subscribe(() => {});
      this.localInstanceProvider
        .setLocalInstanceInstances(
          this.localInstances,
          this.currentUser,
          loggedInInInstance
        )
        .subscribe(() => {});
    } catch (e) {
      this.appProvider.setNormalNotification('Fail to set translation');
      console.log(JSON.stringify(e));
    }
  }

  toggleSettingContents(content) {
    if (content && content.id) {
      if (this.isSettingContentOpen[content.id]) {
        this.isSettingContentOpen[content.id] = false;
      } else {
        Object.keys(this.isSettingContentOpen).forEach(id => {
          this.isSettingContentOpen[id] = false;
        });
        this.isSettingContentOpen[content.id] = true;
      }
    }
  }

  getValuesToTranslate() {
    return [
      'Discovering current user information',
      'Discovering available local instances'
    ];
  }
}
