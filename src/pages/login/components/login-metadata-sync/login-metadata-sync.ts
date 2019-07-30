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
import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { CurrentUser } from '../../../../models/current-user';
import { QueueManager } from '../../../../models/queue-manager';

import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

import { NetworkAvailabilityProvider } from '../../../../providers/network-availability/network-availability';
import { UserProvider } from '../../../../providers/user/user';
import { AppProvider } from '../../../../providers/app/app';
import { SqlLiteProvider } from '../../../../providers/sql-lite/sql-lite';
import { SystemSettingProvider } from '../../../../providers/system-setting/system-setting';
import { OrganisationUnitsProvider } from '../../../../providers/organisation-units/organisation-units';
import { ProgramsProvider } from '../../../../providers/programs/programs';
import { DataSetsProvider } from '../../../../providers/data-sets/data-sets';
import { IndicatorsProvider } from '../../../../providers/indicators/indicators';
import { ProgramRulesProvider } from '../../../../providers/program-rules/program-rules';
import { ProgramStageSectionsProvider } from '../../../../providers/program-stage-sections/program-stage-sections';
import { SectionsProvider } from '../../../../providers/sections/sections';
import { SmsCommandProvider } from '../../../../providers/sms-command/sms-command';
import { StandardReportProvider } from '../../../../providers/standard-report/standard-report';
import { DataElementsProvider } from '../../../../providers/data-elements/data-elements';
import { DataStoreManagerProvider } from '../../../../providers/data-store-manager/data-store-manager';
import { AppColorProvider } from '../../../../providers/app-color/app-color';
import { ValidationRulesProvider } from '../../../../providers/validation-rules/validation-rules';

/**
 * Generated class for the LoginMetadataSyncComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'login-metadata-sync',
  templateUrl: 'login-metadata-sync.html'
})
export class LoginMetadataSyncComponent implements OnDestroy, OnInit {
  @Input()
  currentUser: CurrentUser;
  @Input()
  processes: string[];
  @Input()
  isOnLogin: boolean;
  @Input()
  overAllMessage: string;
  @Input()
  showOverallProgressBar: boolean;

  @Output()
  cancelProgress = new EventEmitter();
  @Output()
  successOnLoginAndSyncMetadata = new EventEmitter();
  @Output()
  systemSettingLoaded = new EventEmitter();
  @Output()
  updateCurrentUser = new EventEmitter();
  @Output()
  failOnLogin = new EventEmitter();

  savingingQueueManager: QueueManager;
  downloadingQueueManager: QueueManager;
  subscriptions: Subscription;
  showCancelButton: boolean;
  trackedResourceTypes: string[];
  progressTrackerPacentage: any;
  progressTrackerMessage: any;
  trackedProcessWithLoader: any;
  completedTrackedProcess: string[];
  progressTrackerBackup: any;
  failedProcesses: any;
  failedProcessesErrors: any;

  constructor(
    private networkAvailabilityProvider: NetworkAvailabilityProvider,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private sqlLiteProvider: SqlLiteProvider,
    private systemSettingProvider: SystemSettingProvider,
    private organisationUnitsProvider: OrganisationUnitsProvider,
    private programsProvider: ProgramsProvider,
    private dataSetsProvider: DataSetsProvider,
    private dataElementsProvider: DataElementsProvider,
    private indicatorsProvider: IndicatorsProvider,
    private programRulesProvider: ProgramRulesProvider,
    private programStageSectionsProvider: ProgramStageSectionsProvider,
    private sectionsProvider: SectionsProvider,
    private smsCommandProvider: SmsCommandProvider,
    private standardReportProvider: StandardReportProvider,
    private dataStoreManagerProvider: DataStoreManagerProvider,
    private appColorProvider: AppColorProvider,
    private validationRulesProvider: ValidationRulesProvider
  ) {
    this.showCancelButton = true;
    this.subscriptions = new Subscription();
    this.progressTrackerPacentage = {};
    this.progressTrackerMessage = {};
    this.trackedProcessWithLoader = {};
    this.completedTrackedProcess = [];
    this.failedProcesses = [];
    this.failedProcessesErrors = [];
  }

  ngOnInit() {
    this.processes = this.processes ? this.processes : [];
    if (this.processes) {
      this.resetQueueManager();
    }
    if (this.currentUser) {
      this.resetCUrrentUserOptionalvalues();
    } else {
      const error = 'Missing current user data';
      this.onFailToLogin({ error });
    }
  }

  resetCUrrentUserOptionalvalues() {
    this.currentUser = _.omit(this.currentUser, [
      'authorities',
      'dhisVersion',
      'id',
      'isPasswordEncode',
      'userOrgUnitIds',
      'dataSets',
      'programs',
      'dataViewOrganisationUnits',
      'name',
      'authorizationKey',
      'currentDatabase'
    ]);
    this.authenticateUser(this.currentUser, this.processes);
  }

  authenticateUser(currentUser: CurrentUser, processes: string[]) {
    currentUser.serverUrl = this.appProvider.getFormattedBaseUrl(
      currentUser.serverUrl
    );
    const { progressTracker } = currentUser;
    if (progressTracker && !this.isOnLogin) {
      this.progressTrackerBackup = progressTracker;
    }
    const networkStatus = this.networkAvailabilityProvider.getNetWorkStatus();
    const { isAvailable } = networkStatus;
    if (!isAvailable && this.isOnLogin) {
      const subscription = this.userProvider
        .offlineUserAuthentication(currentUser)
        .subscribe(
          user => {
            this.successOnLoginAndSyncMetadata.emit({ currentUser: user });
          },
          error => {
            this.onFailToLogin(error);
          }
        );
      this.subscriptions.add(subscription);
    } else if (isAvailable) {
      const currentResouceType = 'communication';
      this.resetProgressTracker(currentUser, processes);
      const subscription = this.userProvider
        .onlineUserAuthentication(currentUser, currentUser.serverUrl)
        .subscribe(
          response => {
            const { serverUrl } = response;
            const { currentUser } = response;
            const { progressTracker } = this.currentUser;
            this.currentUser = _.assign({}, currentUser);
            this.currentUser['progressTracker'] = progressTracker
              ? progressTracker
              : {};
            this.currentUser.serverUrl = serverUrl;
            this.overAllMessage = serverUrl;
            this.currentUser.authorizationKey = btoa(
              currentUser.username + ':' + currentUser.password
            );
            this.currentUser.currentDatabase = this.appProvider.getDataBaseName(
              this.currentUser.serverUrl,
              this.currentUser.username
            );
            const { currentDatabase } = this.currentUser;
            this.resetProgressTracker(this.currentUser, processes);
            const processTracker = this.getProgressTracker(
              this.currentUser,
              processes
            );
            this.currentUser.progressTracker[currentDatabase] = processTracker;
            this.updateCurrentUser.emit(this.currentUser);
            this.updateProgressTrackerObject(
              'Discovering system info',
              null,
              currentResouceType
            );
            //loading system info
            const subscription = this.userProvider
              .getCurrentUserSystemInformationFromServer(this.currentUser)
              .subscribe(
                response => {
                  //saving system information
                  const subscription = this.userProvider
                    .setCurrentUserSystemInformation(response)
                    .subscribe(
                      dhisVersion => {
                        this.currentUser.dhisVersion = dhisVersion;
                        this.updateProgressTrackerObject(
                          'Discovering system settings',
                          null,
                          currentResouceType
                        );
                        //loading system settings
                        const subscription = this.systemSettingProvider
                          .getSystemSettingsFromServer({
                            ...currentUser,
                            dhisVersion,
                            serverUrl
                          })
                          .subscribe(
                            systemSettings => {
                              this.systemSettingLoaded.emit(systemSettings);
                              const { currentStyle } = systemSettings;
                              //loading user authorities
                              this.updateProgressTrackerObject(
                                'Discovering user authorities',
                                null,
                                currentResouceType
                              );
                              const subscription = this.userProvider
                                .getUserAuthorities({
                                  ...currentUser,
                                  dhisVersion,
                                  serverUrl
                                })
                                .subscribe(
                                  response => {
                                    this.currentUser.id = response.id;
                                    this.currentUser.name = response.name;
                                    this.currentUser.authorities =
                                      response.authorities;
                                    this.currentUser.dataViewOrganisationUnits =
                                      response.dataViewOrganisationUnits;
                                    const { settings } = response;
                                    const { keyStyle } = settings;
                                    const colorSettings = this.appColorProvider.getCurrentUserColorObject(
                                      currentStyle,
                                      keyStyle
                                    );
                                    this.currentUser = {
                                      ...this.currentUser,
                                      colorSettings
                                    };
                                    //loading user data
                                    this.updateProgressTrackerObject(
                                      'Discovering user data',
                                      null,
                                      currentResouceType
                                    );
                                    const subscription = this.userProvider
                                      .getUserDataOnAuthenticatedServer(
                                        {
                                          ...currentUser,
                                          dhisVersion,
                                          serverUrl
                                        },
                                        serverUrl,
                                        true
                                      )
                                      .subscribe(
                                        response => {
                                          const { data } = response;
                                          this.currentUser.userOrgUnitIds = _.map(
                                            data.organisationUnits,
                                            (organisationUnit: any) => {
                                              return organisationUnit.id;
                                            }
                                          );
                                          const subscription = this.userProvider
                                            .setUserData(data)
                                            .subscribe(
                                              userData => {
                                                const { dataSets } = userData;
                                                const { programs } = userData;
                                                this.currentUser.dataSets = dataSets;
                                                this.currentUser.programs = programs;
                                                const {
                                                  currentDatabase
                                                } = this.currentUser;
                                                this.completedTrackedProcess = this.getCompletedTrackedProcess(
                                                  this.currentUser
                                                    .progressTracker[
                                                    currentDatabase
                                                  ]
                                                );
                                                if (this.isOnLogin) {
                                                  // preparing local storage
                                                  this.updateProgressTrackerObject(
                                                    'Preparing local storage',
                                                    null,
                                                    currentResouceType
                                                  );
                                                  const {
                                                    currentDatabase
                                                  } = this.currentUser;
                                                  const subscription = this.sqlLiteProvider
                                                    .generateTables(
                                                      currentDatabase
                                                    )
                                                    .subscribe(
                                                      () => {
                                                        this.startSyncMetadataProcesses(
                                                          processes
                                                        );
                                                      },
                                                      error => {
                                                        this.onFailToLogin(
                                                          error
                                                        );
                                                      }
                                                    );
                                                  this.subscriptions.add(
                                                    subscription
                                                  );
                                                } else {
                                                  this.startSyncMetadataProcesses(
                                                    processes
                                                  );
                                                }
                                              },
                                              error => {
                                                this.onFailToLogin(error);
                                              }
                                            );
                                          this.subscriptions.add(subscription);
                                        },
                                        error => {
                                          this.onFailToLogin(error);
                                        }
                                      );
                                    this.subscriptions.add(subscription);
                                  },
                                  error => {
                                    this.onFailToLogin(error);
                                  }
                                );
                              this.subscriptions.add(subscription);
                            },
                            error => {
                              this.onFailToLogin(error);
                            }
                          );
                        this.subscriptions.add(subscription);
                      },
                      error => {
                        this.onFailToLogin(error);
                      }
                    );
                  this.subscriptions.add(subscription);
                },
                error => {
                  this.onFailToLogin(error);
                }
              );
            this.subscriptions.add(subscription);
          },
          error => {
            this.onFailToLogin(error);
          }
        );
      this.subscriptions.add(subscription);
    } else {
      const error = networkStatus.message;
      this.onFailToLogin({ error });
    }
  }

  startSyncMetadataProcesses(processes: string[]) {
    processes.map(process => {
      this.addIntoQueue(process, 'dowmloading');
    });
  }

  resetProgressTracker(currentUser, processes) {
    const processTracker = this.getProgressTracker(currentUser, processes);
    this.trackedResourceTypes = Object.keys(processTracker);
    this.calculateAndSetProgressPercentage(
      this.trackedResourceTypes,
      processTracker
    );
  }

  getProgressTracker(currentUser: CurrentUser, processes: string[]) {
    const emptyProgressTracker = this.getEmptyProcessTracker(processes);
    let progressTrackerObject =
      currentUser &&
      currentUser.currentDatabase &&
      currentUser.progressTracker &&
      currentUser.progressTracker[currentUser.currentDatabase]
        ? !this.isOnLogin
          ? emptyProgressTracker
          : currentUser.progressTracker[currentUser.currentDatabase]
        : emptyProgressTracker;
    try {
      Object.keys(progressTrackerObject).map((key: string) => {
        progressTrackerObject[key].expectedProcesses =
          emptyProgressTracker[key].expectedProcesses;
        progressTrackerObject[key].totalPassedProcesses = 0;
        this.trackedProcessWithLoader[key] = false;
        if (key === 'communication') {
          this.progressTrackerMessage[key] =
            'Establishing connection to server';
          this.trackedProcessWithLoader[key] = true;
        } else if (key === 'entryForm') {
          this.progressTrackerMessage[key] = 'Aggregate metadata';
        } else if (key === 'event') {
          this.progressTrackerMessage[key] = 'Event and tracker metadata';
        } else if (key === 'report') {
          this.progressTrackerMessage[key] = 'Reports metadata';
        }
      });
    } catch (e) {}
    return progressTrackerObject;
  }

  getEmptyProcessTracker(processes: string[]) {
    let progressTracker = {};
    progressTracker['communication'] = {
      expectedProcesses: this.isOnLogin ? 5 : 4,
      totalPassedProcesses: 0,
      passedProcesses: [],
      message: ''
    };
    const dataBaseStructure = this.sqlLiteProvider.getDataBaseStructure();
    processes.map((process: string) => {
      const table = dataBaseStructure[process];
      const { isMetadata } = table;
      const { resourceType } = table;
      if (isMetadata && resourceType && resourceType !== '') {
        if (!progressTracker[resourceType]) {
          progressTracker[resourceType] = {
            expectedProcesses: 0,
            totalPassedProcesses: 0,
            passedProcesses: [],
            message: ''
          };
        }
        progressTracker[resourceType].expectedProcesses += 3;
      }
    });
    return progressTracker;
  }

  updateProgressTrackerObject(
    process: string,
    processMessage?: string,
    currentResouceType?: string
  ) {
    const dataBaseStructure = this.sqlLiteProvider.getDataBaseStructure();
    const typeOfProcess =
      process.split('-').length > 1 ? process.split('-')[1] : 'saving';
    process = process.split('-')[0];
    processMessage = processMessage ? processMessage : process;
    currentResouceType =
      process &&
      dataBaseStructure &&
      dataBaseStructure[process] &&
      dataBaseStructure[process].resourceType
        ? dataBaseStructure[process].resourceType
        : currentResouceType;
    const { currentDatabase } = this.currentUser;
    let progressTracker = this.currentUser.progressTracker[currentDatabase];
    if (progressTracker) {
      if (progressTracker[currentResouceType]) {
        this.progressTrackerMessage[currentResouceType] = processMessage;
        this.trackedProcessWithLoader[currentResouceType] = true;
        progressTracker[currentResouceType].totalPassedProcesses++;
        if (
          progressTracker[currentResouceType].passedProcesses.indexOf(
            process + '-' + typeOfProcess
          ) === -1
        ) {
          progressTracker[currentResouceType].passedProcesses.push(
            process + '-' + typeOfProcess
          );
        }
      }
      this.calculateAndSetProgressPercentage(
        this.trackedResourceTypes,
        progressTracker
      );
    }
  }

  calculateAndSetProgressPercentage(
    trackedResourceTypes: string[],
    progressTracker
  ) {
    const {
      totalExpectedProcesses,
      totalProcesses
    } = this.getTotalExpectedAndCompletedProcess(
      trackedResourceTypes,
      progressTracker
    );
    this.progressTrackerPacentage['overall'] = this.getPercetage(
      totalProcesses,
      totalExpectedProcesses
    );
    const { currentDatabase } = this.currentUser;
    if (currentDatabase) {
      this.currentUser.progressTracker[currentDatabase] = progressTracker;
      this.updateCurrentUser.emit(this.currentUser);
    }
    if (totalProcesses === totalExpectedProcesses) {
      if (this.progressTrackerBackup) {
        this.currentUser = {
          ...this.currentUser,
          progressTracker: this.programsProvider
        };
      }
      this.successOnLoginAndSyncMetadata.emit({
        currentUser: this.currentUser
      });
    } else {
      this.checkingIfAllProcessHavePassed();
    }
  }

  getTotalExpectedAndCompletedProcess(trackedResourceTypes, progressTracker) {
    let totalProcesses = 0;
    let totalExpectedProcesses = 0;
    trackedResourceTypes.map((trackedResourceType: string) => {
      const trackedResource = progressTracker[trackedResourceType];
      const { expectedProcesses } = trackedResource;
      const { totalPassedProcesses } = trackedResource;
      totalProcesses += totalPassedProcesses;
      totalExpectedProcesses += expectedProcesses;
      this.progressTrackerPacentage[trackedResourceType] = this.getPercetage(
        totalPassedProcesses,
        expectedProcesses
      );
    });
    return { totalExpectedProcesses, totalProcesses };
  }

  getCompletedTrackedProcess(progressTracker) {
    let completedTrackedProcess = [];
    Object.keys(progressTracker).map((resourceType: string) => {
      progressTracker[resourceType].passedProcesses.map(
        (passedProcess: any) => {
          const type =
            passedProcess.split('-').length > 1
              ? passedProcess.split('-')[1]
              : passedProcess;
          if (type === 'saving') {
            passedProcess = passedProcess.split('-')[0];
            if (passedProcess) {
              completedTrackedProcess = _.concat(
                completedTrackedProcess,
                passedProcess
              );
            }
          }
        }
      );
    });
    return completedTrackedProcess;
  }

  getPercetage(numerator, denominator) {
    let percentage = 0;
    if (numerator && denominator) {
      percentage = Math.round((numerator / denominator) * 100);
    }
    return String(percentage);
  }

  onFailToLogin(error, process?: string) {
    if (process) {
      if (_.indexOf(this.failedProcesses, process) == -1) {
        this.failedProcesses.push(process);
        this.failedProcessesErrors.push(error);
      }
      this.removeFromQueue(process, 'dowmloading', true);
    } else {
      if (this.progressTrackerBackup) {
        this.currentUser = {
          ...this.currentUser,
          progressTracker: this.progressTrackerBackup
        };
      }
      this.clearAllSubscriptions();
      this.failOnLogin.emit({ error });
    }
  }

  checkingIfAllProcessHavePassed() {
    const { currentDatabase } = this.currentUser;
    if (currentDatabase) {
      let progressTracker = this.currentUser.progressTracker[currentDatabase];
      const {
        totalExpectedProcesses,
        totalProcesses
      } = this.getTotalExpectedAndCompletedProcess(
        this.trackedResourceTypes,
        progressTracker
      );
      if (
        totalExpectedProcesses ===
        totalProcesses + this.failedProcesses.length
      ) {
        this.failOnLogin.emit({
          failedProcesses: this.failedProcesses,
          failedProcessesErrors: this.failedProcessesErrors
        });
        this.clearAllSubscriptions();
      }
    }
  }

  onCancelProgess() {
    if (this.progressTrackerBackup) {
      this.currentUser = {
        ...this.currentUser,
        progressTracker: this.progressTrackerBackup
      };
    }
    this.clearAllSubscriptions();
    this.cancelProgress.emit();
  }

  resetQueueManager() {
    this.savingingQueueManager = {
      enqueuedProcess: [],
      dequeuingLimit: 1,
      denqueuedProcess: [],
      data: {}
    };
    this.downloadingQueueManager = {
      totalProcess: this.processes.length,
      enqueuedProcess: [],
      dequeuingLimit: 4,
      denqueuedProcess: []
    };
  }

  addIntoQueue(process: string, type?: string, data?: any) {
    if (type && type === 'saving') {
      if (data) {
        this.savingingQueueManager.enqueuedProcess = _.concat(
          this.savingingQueueManager.enqueuedProcess,
          process
        );
        this.savingingQueueManager.data[process] = data;
      }
      this.checkingAndStartSavingProcess();
    } else if (type && type === 'dowmloading') {
      this.downloadingQueueManager.enqueuedProcess = _.concat(
        this.downloadingQueueManager.enqueuedProcess,
        process
      );
      this.checkingAndStartDownloadProcess();
    }
  }

  removeFromQueue(
    process: string,
    type: string,
    shouldPassProces: boolean,
    data?: any
  ) {
    if (type && type === 'saving') {
      _.remove(
        this.savingingQueueManager.denqueuedProcess,
        denqueuedProcess => {
          return process === denqueuedProcess;
        }
      );
      if (
        this.savingingQueueManager &&
        this.savingingQueueManager.data &&
        this.savingingQueueManager.data[process]
      ) {
        this.savingingQueueManager.data[process] = [];
      }
      const { currentDatabase } = this.currentUser;
      this.completedTrackedProcess = this.getCompletedTrackedProcess(
        this.currentUser.progressTracker[currentDatabase]
      );
      const processType = 'saving';
      const progressMessage = this.getProgressMessage(process, processType);
      this.updateProgressTrackerObject(
        process + '-' + processType,
        progressMessage
      );
      this.checkingAndStartSavingProcess();
    } else if (type && type === 'dowmloading') {
      _.remove(
        this.downloadingQueueManager.denqueuedProcess,
        denqueuedProcess => {
          return process === denqueuedProcess;
        }
      );
      if (data) {
        this.addIntoQueue(process, 'saving', data);
      } else {
        let processType = 'start-saving';
        let progressMessage = this.getProgressMessage(process, processType);
        this.updateProgressTrackerObject(
          process + '-' + processType,
          progressMessage
        );
        if (!shouldPassProces) {
          processType = 'saving';
          progressMessage = this.getProgressMessage(process, processType);
          this.updateProgressTrackerObject(
            process + '-' + processType,
            progressMessage
          );
        }
      }
      this.checkingAndStartDownloadProcess();
    }
  }

  getProgressMessage(process: string, processType: string) {
    let progressMessage = processType + ' ' + process;
    if (processType === 'dowmloading') {
      if (process === 'organisationUnits') {
        progressMessage = 'Discovering assigned organisation units';
      } else if (process === 'dataSets') {
        progressMessage = 'Discovering entry forms';
      } else if (process === 'sections') {
        progressMessage = 'Discovering entry form sections';
      } else if (process === 'dataElements') {
        progressMessage = 'Discovering entry form fields';
      } else if (process === 'categoryCombos') {
        progressMessage = 'Discovering entry form fields categories';
      } else if (process === 'smsCommand') {
        progressMessage = 'Discovering SMS commands';
      } else if (process === 'programs') {
        progressMessage = 'Discovering programs';
      } else if (process === 'programStageSections') {
        progressMessage = 'Discovering program stage section';
      } else if (process === 'programRules') {
        progressMessage = 'Discovering program rules';
      } else if (process === 'programRuleActions') {
        progressMessage = 'Discovering program rules actions';
      } else if (process === 'programRuleVariables') {
        progressMessage = 'Discovering program rules variables';
      } else if (process === 'indicators') {
        progressMessage = 'Discovering indicators';
      } else if (process === 'reports') {
        progressMessage = 'Discovering standard reports';
      } else if (process === 'constants') {
        progressMessage = 'Discovering constants';
      } else if (process === 'dataStore') {
        progressMessage = 'Discovering data store';
      } else if (process === 'validationRules') {
        progressMessage = 'Discovering validation rules';
      } else {
        progressMessage = 'Discovering ' + process;
      }
    } else if (processType === 'start-saving') {
      if (process === 'organisationUnits') {
        progressMessage = 'Saving assigned organisation units';
      } else if (process === 'dataSets') {
        progressMessage = 'Saving entry forms';
      } else if (process === 'sections') {
        progressMessage = 'Saving entry form sections';
      } else if (process === 'dataElements') {
        progressMessage = 'Saving entry form fields';
      } else if (process === 'categoryCombos') {
        progressMessage = 'Saving entry form fields categories';
      } else if (process === 'smsCommand') {
        progressMessage = 'Saving SMS commands';
      } else if (process === 'programs') {
        progressMessage = 'Saving programs';
      } else if (process === 'programStageSections') {
        progressMessage = 'Saving program stage section';
      } else if (process === 'programRules') {
        progressMessage = 'Saving program rules';
      } else if (process === 'programRuleActions') {
        progressMessage = 'Saving program rules actions';
      } else if (process === 'programRuleVariables') {
        progressMessage = 'Saving program rules variables';
      } else if (process === 'indicators') {
        progressMessage = 'Saving indicators';
      } else if (process === 'reports') {
        progressMessage = 'Saving standard reports';
      } else if (process === 'constants') {
        progressMessage = 'Saving constants';
      } else if (process === 'dataStore') {
        progressMessage = 'Saving data store';
      } else if (process === 'validationRules') {
        progressMessage = 'Saving validation rules';
      } else {
        progressMessage = 'Saving ' + process;
      }
    } else if (processType === 'saving') {
      if (process === 'organisationUnits') {
        progressMessage = 'Assigned organisation units have been discovered';
      } else if (process === 'dataSets') {
        progressMessage = 'Entry forms have been discovered';
      } else if (process === 'sections') {
        progressMessage = 'Entry form sections have been discovered';
      } else if (process === 'dataElements') {
        progressMessage = 'Entry form fields have been discovered';
      } else if (process === 'categoryCombos') {
        progressMessage = 'Entry form fields categories have been discovered';
      } else if (process === 'smsCommand') {
        progressMessage = 'SMS commands have been discovered';
      } else if (process === 'programs') {
        progressMessage = 'Programs have been discovered';
      } else if (process === 'programStageSections') {
        progressMessage = 'Program stage section have been discovered';
      } else if (process === 'programRules') {
        progressMessage = 'Program Rules have been discovered';
      } else if (process === 'programRuleActions') {
        progressMessage = 'Program rules actions have been discovered';
      } else if (process === 'programRuleVariables') {
        progressMessage = 'Program rules variables have been discovered';
      } else if (process === 'indicators') {
        progressMessage = 'Indicators have been discovered';
      } else if (process === 'reports') {
        progressMessage = 'Reports have been discovered';
      } else if (process === 'constants') {
        progressMessage = 'Constants have been discovered';
      } else if (process === 'dataStore') {
        progressMessage = 'Data store has been discovered';
      } else if (process === 'validationRules') {
        progressMessage = 'Validation rules has been discovered';
      } else {
        progressMessage = process + ' have been discovered';
      }
    }
    return progressMessage;
  }

  checkingAndStartSavingProcess() {
    if (
      this.savingingQueueManager.denqueuedProcess.length <
      this.savingingQueueManager.dequeuingLimit
    ) {
      const process = _.head(this.savingingQueueManager.enqueuedProcess);
      if (process) {
        const data = this.savingingQueueManager.data[process];
        delete this.savingingQueueManager.data[process];
        this.savingingQueueManager.denqueuedProcess = _.concat(
          this.savingingQueueManager.denqueuedProcess,
          process
        );
        _.remove(
          this.savingingQueueManager.enqueuedProcess,
          enqueuedProcess => {
            return process === enqueuedProcess;
          }
        );
        this.startSavingProcess(process, data);
      }
    }
  }

  checkingAndStartDownloadProcess() {
    if (
      this.downloadingQueueManager.denqueuedProcess.length <
      this.downloadingQueueManager.dequeuingLimit
    ) {
      const process = _.head(this.downloadingQueueManager.enqueuedProcess);
      if (process) {
        this.downloadingQueueManager.denqueuedProcess = _.concat(
          this.downloadingQueueManager.denqueuedProcess,
          process
        );
        _.remove(
          this.downloadingQueueManager.enqueuedProcess,
          enqueuedProcess => {
            return process === enqueuedProcess;
          }
        );
        this.startDownloadProcess(process);
      }
    }
  }

  startDownloadProcess(process: string) {
    const type = 'dowmloading';
    const progressMessage = this.getProgressMessage(process, type);
    this.updateProgressTrackerObject(process + '-' + type, progressMessage);
    if (this.completedTrackedProcess.indexOf(process) === -1) {
      if (process === 'organisationUnits') {
        this.subscriptions.add(
          this.organisationUnitsProvider
            .downloadingOrganisationUnitsFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'dataSets') {
        this.subscriptions.add(
          this.dataSetsProvider
            .downloadDataSetsFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'sections') {
        this.subscriptions.add(
          this.sectionsProvider
            .downloadSectionsFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'dataElements') {
        this.subscriptions.add(
          this.dataElementsProvider
            .downloadDataElementsFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'categoryCombos') {
        this.subscriptions.add(
          this.dataElementsProvider
            .downloadDataElementCatogoryCombos(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'smsCommand') {
        this.subscriptions.add(
          this.smsCommandProvider
            .getSmsCommandFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'programs') {
        this.subscriptions.add(
          this.programsProvider
            .downloadProgramsFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'programStageSections') {
        this.subscriptions.add(
          this.programStageSectionsProvider
            .downloadProgramsStageSectionsFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'programRules') {
        this.subscriptions.add(
          this.programRulesProvider
            .downloadingProgramRules(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'programRuleActions') {
        this.subscriptions.add(
          this.programRulesProvider
            .downloadingProgramRuleActions(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'programRuleVariables') {
        this.subscriptions.add(
          this.programRulesProvider
            .downloadingProgramRuleVariables(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'indicators') {
        this.subscriptions.add(
          this.indicatorsProvider
            .downloadingIndicatorsFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'reports') {
        this.subscriptions.add(
          this.standardReportProvider
            .downloadReportsFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'constants') {
        this.subscriptions.add(
          this.standardReportProvider
            .downloadConstantsFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'dataStore') {
        this.subscriptions.add(
          this.dataStoreManagerProvider
            .getDataStoreFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      } else if (process === 'validationRules') {
        this.subscriptions.add(
          this.validationRulesProvider
            .discoveringValidationRulesFromServer(this.currentUser)
            .subscribe(
              response => {
                this.removeFromQueue(process, 'dowmloading', false, response);
              },
              error => {
                console.log(process + ' : ' + JSON.stringify(error));
                this.onFailToLogin(error, process);
              }
            )
        );
      }
    } else {
      this.removeFromQueue(process, 'dowmloading', false);
    }
  }

  startSavingProcess(process: string, data: any) {
    const type = 'start-saving';
    const progressMessage = this.getProgressMessage(process, type);
    this.updateProgressTrackerObject(process + '-' + type, progressMessage);
    if (process === 'organisationUnits') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.organisationUnitsProvider
            .savingOrganisationUnitsFromServer(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.organisationUnitsProvider
                .savingOrganisationUnitsFromServer(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'dataSets') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.dataSetsProvider
            .saveDataSetsFromServer(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              errror => {
                this.onFailToLogin(errror);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.dataSetsProvider
                .saveDataSetsFromServer(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  errror => {
                    this.onFailToLogin(errror);
                  }
                );
            })
        );
      }
    } else if (process === 'sections') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.sectionsProvider
            .saveSectionsFromServer(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.sectionsProvider
                .saveSectionsFromServer(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'dataElements') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.dataElementsProvider
            .saveDataElementsFromServer(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.dataElementsProvider
                .saveDataElementsFromServer(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'categoryCombos') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.dataElementsProvider
            .saveDataElementCatogoryCombos(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.dataElementsProvider
                .saveDataElementCatogoryCombos(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'smsCommand') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.smsCommandProvider
            .savingSmsCommand(data, this.currentUser.currentDatabase)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.smsCommandProvider
                .savingSmsCommand(data, this.currentUser.currentDatabase)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'programs') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.programsProvider
            .saveProgramsFromServer(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.programsProvider
                .saveProgramsFromServer(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'programStageSections') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.programStageSectionsProvider
            .saveProgramsStageSectionsFromServer(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.programStageSectionsProvider
                .saveProgramsStageSectionsFromServer(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'programRules') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.programRulesProvider
            .savingProgramRules(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.programRulesProvider
                .savingProgramRules(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'programRuleActions') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.programRulesProvider
            .savingProgramRuleActions(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.programRulesProvider
                .savingProgramRuleActions(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'programRuleVariables') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.programRulesProvider
            .savingProgramRuleVariables(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.programRulesProvider
                .savingProgramRuleVariables(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'indicators') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.indicatorsProvider
            .savingIndicatorsFromServer(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.indicatorsProvider
                .savingIndicatorsFromServer(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'reports') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.standardReportProvider
            .saveReportsFromServer(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.standardReportProvider
                .saveReportsFromServer(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'constants') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.standardReportProvider
            .saveConstantsFromServer(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.subscriptions.add(
                this.standardReportProvider
                  .saveConstantsFromServer(data, this.currentUser)
                  .subscribe(
                    () => {
                      this.removeFromQueue(process, 'saving', false);
                    },
                    error => {
                      this.onFailToLogin(error, process);
                    }
                  )
              );
            })
        );
      }
    } else if (process === 'dataStore') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.dataStoreManagerProvider
            .saveDataStoreDataFromServer(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.dataStoreManagerProvider
                .saveDataStoreDataFromServer(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    } else if (process === 'validationRules') {
      if (this.isOnLogin) {
        this.subscriptions.add(
          this.validationRulesProvider
            .savingValidationRules(data, this.currentUser)
            .subscribe(
              () => {
                this.removeFromQueue(process, 'saving', false);
              },
              error => {
                this.onFailToLogin(error, process);
              }
            )
        );
      } else {
        this.subscriptions.add(
          this.sqlLiteProvider
            .dropAndRecreateTable(process, this.currentUser.currentDatabase)
            .subscribe(() => {
              this.validationRulesProvider
                .savingValidationRules(data, this.currentUser)
                .subscribe(
                  () => {
                    this.removeFromQueue(process, 'saving', false);
                  },
                  error => {
                    this.onFailToLogin(error, process);
                  }
                );
            })
        );
      }
    }
  }

  clearAllSubscriptions() {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  ngOnDestroy() {
    this.clearAllSubscriptions();
    this.processes = null;
    this.progressTrackerBackup = null;
    this.isOnLogin = null;
    this.failedProcesses = null;
    this.failedProcessesErrors = null;
    this.overAllMessage = null;
    this.savingingQueueManager = null;
    this.showOverallProgressBar = null;
    this.downloadingQueueManager = null;
    this.showCancelButton = null;
    this.progressTrackerPacentage = null;
    this.progressTrackerMessage = null;
    this.trackedProcessWithLoader = null;
    this.completedTrackedProcess = null;
  }
}
