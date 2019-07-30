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
import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { LocalInstanceProvider } from '../../providers/local-instance/local-instance';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { SynchronizationProvider } from '../../providers/synchronization/synchronization';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit {
  isSettingContentOpen: any;
  settingContents: Array<any>;
  isLoading: boolean = false;
  settingObject: any;
  loadingMessage: string;
  currentUser: any;
  currentLanguage: string;
  translationCodes: Array<any> = [];
  localInstances: any;
  translationMapper: any;
  shouldRestartSynchronizationProcess: boolean;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private settingsProvider: SettingsProvider,
    private appProvider: AppProvider,
    private localInstanceProvider: LocalInstanceProvider,
    private appTranslationProvider: AppTranslationProvider,
    private userProvider: UserProvider,
    private synchronizationProvider: SynchronizationProvider
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.shouldRestartSynchronizationProcess = false;
    this.settingObject = {};
    this.translationCodes = this.appTranslationProvider.getSupportedTranslationObjects();
    this.isLoading = true;
    this.isSettingContentOpen = {};
    this.settingContents = this.settingsProvider.getSettingContentDetails();
  }

  ngOnInit() {
    if (this.settingContents.length > 0) {
      this.toggleSettingContents(this.settingContents[0]);
    }
    this.translationMapper = {};
    this.appTranslationProvider
      .getTransalations(this.getValuesToTranslate())
      .subscribe(
        (data: any) => {
          this.translationMapper = data;
          this.loadingUserInformation();
        },
        error => {
          this.loadingUserInformation();
        }
      );
  }

  loadingUserInformation() {
    let key = 'Discovering current user information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    const defaultSettings = this.settingsProvider.getDefaultSettings();
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.currentLanguage = currentUser.currentLanguage;
        key = 'Discovering settings';
        this.loadingMessage = this.translationMapper[key]
          ? this.translationMapper[key]
          : key;
        this.localInstanceProvider.getLocalInstances().subscribe(
          (instances: any) => {
            this.localInstances = instances;
            this.settingsProvider
              .getSettingsForTheApp(this.currentUser)
              .subscribe(
                (appSettings: any) => {
                  this.initiateSettings(defaultSettings, appSettings);
                },
                error => {
                  console.log(error);
                  this.isLoading = false;
                  this.initiateSettings(defaultSettings, null);
                  this.appProvider.setNormalNotification(
                    'Failed to discover settings'
                  );
                }
              );
          },
          error => {
            this.isLoading = false;
            this.appProvider.setNormalNotification(
              'Failed to discover available local instances'
            );
          }
        );
      },
      error => {
        console.log(error);
        this.isLoading = false;
        this.initiateSettings(defaultSettings, null);
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  initiateSettings(defaultSettings, appSettings) {
    if (appSettings) {
      if (appSettings.synchronization) {
        this.settingObject['synchronization'] = appSettings.synchronization;
      } else {
        this.settingObject['synchronization'] = defaultSettings.synchronization;
      }
      if (appSettings.entryForm) {
        this.settingObject['entryForm'] = appSettings.entryForm;
      } else {
        this.settingObject['entryForm'] = defaultSettings.entryForm;
      }
      if (appSettings.barcode) {
        this.settingObject['barcode'] = appSettings.barcode;
      } else {
        this.settingObject['barcode'] = defaultSettings.barcode;
      }
    } else {
      this.settingObject = defaultSettings;
    }
    let timeValue = this.settingObject.synchronization.time;
    let timeType = this.settingObject.synchronization.timeType;
    this.settingObject.synchronization.time = this.settingsProvider.getDisplaySynchronizationTime(
      timeValue,
      timeType
    );
    this.isLoading = false;
  }

  updateCurrentLanguage(currentLanguage) {
    try {
      let loggedInInInstance = this.currentUser.serverUrl;
      if (this.currentUser.serverUrl.split('://').length > 1) {
        loggedInInInstance = this.currentUser.serverUrl.split('://')[1];
      }
      this.currentLanguage = currentLanguage;
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
      this.appProvider.setNormalNotification('Failed to set translation');
      console.log(JSON.stringify(e));
    }
  }

  updateAutoSyncSetting(event, settingContent) {
    this.shouldRestartSynchronizationProcess = true;
    this.applySettings(settingContent);
  }

  applySettings(settingContent) {
    this.settingsProvider
      .setSettingsForTheApp(this.currentUser, this.settingObject)
      .subscribe(
        () => {
          this.appProvider.setNormalNotification(
            'Settings have been updated successfully',
            2000
          );
          this.settingsProvider
            .getSettingsForTheApp(this.currentUser)
            .subscribe(
              (appSettings: any) => {
                this.settingObject = appSettings;
                let timeValue = this.settingObject.synchronization.time;
                let timeType = this.settingObject.synchronization.timeType;
                this.settingObject.synchronization.time = this.settingsProvider.getDisplaySynchronizationTime(
                  timeValue,
                  timeType
                );
                if (this.shouldRestartSynchronizationProcess) {
                  this.synchronizationProvider.startSynchronization(
                    this.currentUser
                  );
                }
                this.shouldRestartSynchronizationProcess = false;
              },
              error => {
                console.log(error);
                this.appProvider.setNormalNotification(
                  'Failed to discover settings'
                );
              }
            );
        },
        error => {
          this.appProvider.setNormalNotification(
            'Failed to apply changes on  settings'
          );
        }
      );
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

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getValuesToTranslate() {
    return ['Discovering current user information', 'Discovering settings'];
  }
}
