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
import { Injectable } from '@angular/core';
import { DataValuesProvider } from '../data-values/data-values';
import { TrackerCaptureProvider } from '../tracker-capture/tracker-capture';
import { EnrollmentsProvider } from '../enrollments/enrollments';
import { EventCaptureFormProvider } from '../event-capture-form/event-capture-form';
import * as _ from 'lodash';
import { AppProvider } from '../app/app';
import { SettingsProvider } from '../settings/settings';
import { Observable } from 'rxjs/Observable';
import { ProfileProvider } from '../../pages/profile/providers/profile/profile';
import { CurrentUser } from '../../models';
import { DataStoreManagerProvider } from '../data-store-manager/data-store-manager';

/*
  Generated class for the SynchronizationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SynchronizationProvider {
  subscription: any;
  profileSubscription: any;

  constructor(
    private dataValuesProvider: DataValuesProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private enrollmentsProvider: EnrollmentsProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private dataStoreManger: DataStoreManagerProvider,
    private appProvider: AppProvider,
    private settingsProvider: SettingsProvider,
    private profileProvider: ProfileProvider
  ) {}

  stopSynchronization() {
    if (this.subscription) {
      clearInterval(this.subscription);
    }
    if (this.profileSubscription) {
      clearInterval(this.profileSubscription);
    }
  }

  startSynchronization(currentUser) {
    const defaultSettings = this.settingsProvider.getDefaultSettings();
    this.settingsProvider.getSettingsForTheApp(currentUser).subscribe(
      (appSettings: any) => {
        const synchronizationSettings =
          appSettings && appSettings.synchronization
            ? appSettings.synchronization
            : defaultSettings.synchronization;
        this.stopSynchronization();
        this.profileSubscription = setInterval(() => {
          this.profileProvider.uploadingProfileInformation();
        }, synchronizationSettings.time);
        if (synchronizationSettings.isAutoSync) {
          this.subscription = setInterval(() => {
            this.getDataForUpload(currentUser).subscribe(
              dataObject => {
                this.uploadingDataToTheServer(
                  dataObject,
                  currentUser
                ).subscribe(
                  response => {
                    const { isCompleted } = response;
                    const { importSummaries } = response;
                    if (isCompleted) {
                      let message = '';
                      Object.keys(importSummaries).map(key => {
                        let newKey = key.charAt(0).toUpperCase() + key.slice(1);
                        newKey = newKey.replace(/([A-Z])/g, ' $1').trim();
                        const { success } = importSummaries[key];
                        if (success) {
                          message += newKey + ' ' + success + ', ';
                        }
                      });
                      if (message != '') {
                        message += 'has been successfully imported ';
                        this.appProvider.setTopNotification(message);
                      }
                    }
                  },
                  error => {}
                );
              },
              error => {}
            );
          }, synchronizationSettings.time);
        }
      },
      error => {
        console.log;
        JSON.stringify(error);
      }
    );
  }

  uploadingDataToTheServer(dataObject, currentUser): Observable<any> {
    return new Observable(observer => {
      let completedProcess = 0;
      const dataItems = _.filter(Object.keys(dataObject), key => {
        return dataObject && dataObject[key] && dataObject[key].length > 0;
      });
      const response = {
        percentage: '',
        importSummaries: {},
        isCompleted: false
      };
      for (let item of dataItems) {
        if (dataObject[item].length > 0) {
          if (item === 'dataValues') {
            let formattedDataValues = this.dataValuesProvider.getFormattedDataValueForUpload(
              dataObject[item]
            );
            this.dataValuesProvider
              .uploadDataValues(
                formattedDataValues,
                dataObject[item],
                currentUser
              )
              .subscribe(
                importSummaries => {
                  completedProcess++;
                  response.importSummaries[item] = importSummaries;
                  const percentage =
                    (completedProcess / dataItems.length) * 100;
                  response.percentage = percentage.toFixed(1);
                  observer.next(response);
                  if (dataItems.length === completedProcess) {
                    response.isCompleted = true;
                    observer.next(response);
                    observer.complete();
                  }
                },
                error => {
                  observer.error(error);
                  console.log(
                    'Error on uploading dataValues ' + JSON.stringify(error)
                  );
                }
              );
          } else if (item === 'dataStore') {
            this.dataStoreManger
              .uploadDataStoreToTheServer(dataObject[item], currentUser)
              .subscribe(
                importSummaries => {
                  completedProcess++;
                  response.importSummaries[item] = importSummaries;
                  const percentage =
                    (completedProcess / dataItems.length) * 100;
                  response.percentage = percentage.toFixed(1);
                  observer.next(response);
                  if (dataItems.length === completedProcess) {
                    response.isCompleted = true;
                    observer.next(response);
                    observer.complete();
                  }
                },
                error => {
                  observer.error(error);
                  console.log(
                    'Error on uploading events ' + JSON.stringify(error)
                  );
                }
              );
          } else if (item === 'events') {
            this.eventCaptureFormProvider
              .uploadEventsToSever(dataObject[item], currentUser)
              .subscribe(
                importSummaries => {
                  completedProcess++;
                  response.importSummaries[item] = importSummaries;
                  const percentage =
                    (completedProcess / dataItems.length) * 100;
                  response.percentage = percentage.toFixed(1);
                  observer.next(response);
                  if (dataItems.length === completedProcess) {
                    response.isCompleted = true;
                    observer.next(response);
                    observer.complete();
                  }
                },
                error => {
                  observer.error(error);
                  console.log(
                    'Error on uploading events ' + JSON.stringify(error)
                  );
                }
              );
          } else if (
            item === 'eventsForTracker' &&
            dataObject['Enrollments'] &&
            dataObject['Enrollments'].length === 0
          ) {
            this.eventCaptureFormProvider
              .uploadEventsToSever(dataObject[item], currentUser)
              .subscribe(
                importSummaries => {
                  completedProcess++;
                  response.importSummaries[item] = importSummaries;
                  const percentage =
                    (completedProcess / dataItems.length) * 100;
                  response.percentage = percentage.toFixed(1);
                  observer.next(response);
                  if (dataItems.length === completedProcess) {
                    response.isCompleted = true;
                    observer.next(response);
                    observer.complete();
                  }
                },
                error => {
                  observer.error(error);
                  console.log(
                    'Error on uploading tracker event ' + JSON.stringify(error)
                  );
                }
              );
          } else if (item === 'Enrollments') {
            this.trackerCaptureProvider
              .uploadTrackedEntityInstancesToServer(
                dataObject[item],
                dataObject[item],
                currentUser
              )
              .subscribe(
                (responseData: any) => {
                  completedProcess++;
                  response.importSummaries[item] = responseData.importSummaries;
                  const percentage =
                    (completedProcess / dataItems.length) * 100;
                  response.percentage = percentage.toFixed(1);
                  observer.next(response);
                  this.enrollmentsProvider
                    .getSavedEnrollmentsByAttribute(
                      'trackedEntityInstance',
                      responseData.trackedEntityInstanceIds,
                      currentUser
                    )
                    .subscribe(
                      (enrollments: any) => {
                        this.trackerCaptureProvider
                          .uploadEnrollments(enrollments, currentUser)
                          .subscribe(
                            () => {
                              this.eventCaptureFormProvider
                                .uploadEventsToSever(
                                  dataObject['eventsForTracker'],
                                  currentUser
                                )
                                .subscribe(
                                  importSummaries => {
                                    completedProcess++;
                                    const percentage =
                                      (completedProcess / dataItems.length) *
                                      100;
                                    response.percentage = percentage.toFixed(1);
                                    response.importSummaries[
                                      'eventsForTracker'
                                    ] = importSummaries;
                                    observer.next(response);
                                    if (dataItems.length === completedProcess) {
                                      response.isCompleted = true;
                                      observer.next(response);
                                      observer.complete();
                                    }
                                  },
                                  error => {
                                    observer.error(error);
                                    console.log(
                                      'Error on uploading tracker event ' +
                                        JSON.stringify(error)
                                    );
                                  }
                                );
                            },
                            error => {
                              observer.error(error);
                              console.log(
                                'Error on uploading enrollments ' +
                                  JSON.stringify(error)
                              );
                            }
                          );
                      },
                      error => {
                        observer.error(error);
                        console.log(
                          'Error on saving enrollments by attributes' +
                            JSON.stringify(error)
                        );
                      }
                    );
                },
                error => {
                  observer.error(error);
                  console.log(
                    'Error on uloading tracked entities ' +
                      JSON.stringify(error)
                  );
                }
              );
          }
        } else {
          completedProcess++;
          const percentage = (completedProcess / dataItems.length) * 100;
          response.percentage = percentage.toFixed(1);
          observer.next(response);
          if (dataItems.length === completedProcess) {
            response.isCompleted = true;
            observer.next(response);
            observer.complete();
          }
        }
      }
    });
  }

  getDataForUpload(currentUser): Observable<any> {
    return new Observable(observer => {
      const status = 'not-synced';
      let dataObject = {
        events: [],
        dataValues: [],
        eventsForTracker: [],
        Enrollments: [],
        dataStore: []
      };
      this.dataValuesProvider
        .getDataValuesByStatus(status, currentUser)
        .subscribe(
          (dataValues: any) => {
            dataObject = { ...dataObject, dataValues };
            this.trackerCaptureProvider
              .getTrackedEntityInstanceByStatus(status, currentUser)
              .subscribe(
                (trackedEntityInstances: any) => {
                  dataObject = {
                    ...dataObject,
                    Enrollments: trackedEntityInstances
                  };
                  this.eventCaptureFormProvider
                    .getEventsByAttribute('syncStatus', [status], currentUser)
                    .subscribe(
                      (events: any) => {
                        dataObject.events = _.filter(events, (event: any) => {
                          return event.eventType === 'event-capture';
                        });
                        dataObject.eventsForTracker = _.filter(
                          events,
                          (event: any) => {
                            return event.eventType === 'tracker-capture';
                          }
                        );
                        this.dataStoreManger
                          .getAllSavedDataStoreData(currentUser)
                          .subscribe(
                            (data: any) => {
                              const dataStores = _.filter(
                                data,
                                (dataStore: any) => {
                                  return dataStore.status === status;
                                }
                              );
                              dataObject = {
                                ...dataObject,
                                dataStore: dataStores
                              };
                              observer.next(dataObject);
                              observer.complete();
                            },
                            error => {
                              console.log('error : dataStore');
                              console.log(JSON.stringify(error));
                              observer.error(error);
                            }
                          );
                      },
                      error => {
                        console.log('error : events');
                        console.log(JSON.stringify(error));
                        observer.error(error);
                      }
                    );
                },
                error => {
                  console.log('error : enrollment');
                  console.log(JSON.stringify(error));
                  observer.error(error);
                }
              );
          },
          error => {
            console.log('error : data values');
            console.log(JSON.stringify(error));
            observer.error(error);
          }
        );
    });
  }

  syncAllOfflineDataToServer(currentUser: CurrentUser): Observable<any> {
    return new Observable(observer => {
      this.getDataForUpload(currentUser).subscribe(
        dataObject => {
          this.uploadingDataToTheServer(dataObject, currentUser).subscribe(
            response => {
              const percentage =
                response && response.percentage
                  ? parseInt(response.percentage)
                  : 0;
              if (percentage >= 100) {
                observer.next(response);
                observer.complete();
              }
            },
            error => {
              observer.error(error);
            }
          );
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
}
