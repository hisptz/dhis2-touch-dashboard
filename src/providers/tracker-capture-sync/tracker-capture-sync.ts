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
import { EnrollmentsProvider } from '../enrollments/enrollments';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import { CurrentUser } from '../../models';
import * as _ from 'lodash';

@Injectable()
export class TrackerCaptureSyncProvider {
  constructor(
    private enrollmentsProvider: EnrollmentsProvider,
    private sqlLite: SqlLiteProvider,
    private httpClientProvider: HttpClientProvider
  ) {}

  getSelectedEnrollementEventsByTrackedEntityInstances(
    trackedEntityInstances,
    discoveredTrackerData
  ) {
    const trackedEntityInstanceIds = _.map(
      trackedEntityInstances,
      trackedEntityInstanceObj => trackedEntityInstanceObj.trackedEntityInstance
    );
    const enrollments = _.filter(
      discoveredTrackerData.enrollments,
      enrollment => {
        return (
          _.indexOf(
            trackedEntityInstanceIds,
            enrollment.trackedEntityInstance
          ) !== -1
        );
      }
    );
    const events = _.filter(discoveredTrackerData.events, event => {
      return (
        _.indexOf(trackedEntityInstanceIds, event.trackedEntityInstance) !== -1
      );
    });
    return { events, enrollments };
  }

  getTrackedEntityInstancesByStatus(
    discoveredTrackerData,
    offlineTrackedEntityInstanceIds
  ) {
    const trackedEntityInstanceWithConflicts =
      discoveredTrackerData && discoveredTrackerData.trackedEntityInstances
        ? _.filter(
            discoveredTrackerData.trackedEntityInstances,
            trackedEntityInstanceObj => {
              return (
                _.indexOf(
                  offlineTrackedEntityInstanceIds,
                  trackedEntityInstanceObj.trackedEntityInstance
                ) !== -1
              );
            }
          )
        : [];
    const trackedEntityInstanceWithoutConflicts =
      discoveredTrackerData && discoveredTrackerData.trackedEntityInstances
        ? _.filter(
            discoveredTrackerData.trackedEntityInstances,
            trackedEntityInstanceObj => {
              return (
                _.indexOf(
                  offlineTrackedEntityInstanceIds,
                  trackedEntityInstanceObj.trackedEntityInstance
                ) === -1
              );
            }
          )
        : [];

    return {
      trackedEntityInstanceWithConflicts,
      trackedEntityInstanceWithoutConflicts
    };
  }

  discoveringTrackerDataFromServer(
    eventType: string,
    organisationUnitId: string,
    orgUnitName: string,
    programId: string,
    programName: string,
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      const syncStatus = 'synced';
      this.discoveringTrackedEntityInstancesFromServer(
        organisationUnitId,
        orgUnitName,
        programId,
        syncStatus,
        currentUser
      ).subscribe(
        trackedEntityInstances => {
          this.discoveringEnrollmentsFromServer(
            organisationUnitId,
            programId,
            syncStatus,
            currentUser
          ).subscribe(
            enrollments => {
              this.discoveringEventsForTrackerFromServer(
                organisationUnitId,
                programId,
                eventType,
                syncStatus,
                programName,
                currentUser
              ).subscribe(
                events => {
                  observer.next({
                    trackedEntityInstances,
                    enrollments,
                    events
                  });
                  observer.complete();
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
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  discoveringTrackedEntityInstancesFromServer(
    organisationUnitId: string,
    orgUnitName: string,
    programId: string,
    syncStatus: string,
    currentUser: CurrentUser
  ): Observable<any> {
    const url = `/api/trackedEntityInstances.json?ou=${organisationUnitId}&program=${programId}&pageSize=50&order=lastUpdated:desc`;
    return new Observable(observer => {
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        trackedEntityInstancesResponse => {
          const trackedEntityInstances = _.map(
            trackedEntityInstancesResponse.trackedEntityInstances,
            trackedEntityInstanceObj => {
              const {
                trackedEntity,
                trackedEntityType
              } = trackedEntityInstanceObj;
              const trackedEntityValue = trackedEntityType
                ? trackedEntityType
                : trackedEntity;
              const trackedEntityInstanceId =
                trackedEntityInstanceObj.trackedEntityInstance;
              const attributes = _.map(
                trackedEntityInstanceObj.attributes,
                attributeObj => {
                  const { value, attribute } = attributeObj;
                  const trackedEntityAttributeValueId = `${trackedEntityInstanceId}-${attribute}`;
                  return {
                    ...{},
                    id: trackedEntityAttributeValueId,
                    trackedEntityInstance: trackedEntityInstanceId,
                    value,
                    attribute
                  };
                }
              );
              delete trackedEntityInstanceObj.attributes;
              return {
                ...trackedEntityInstanceObj,
                orgUnitName,
                syncStatus,
                trackedEntity: trackedEntityValue,
                id: trackedEntityInstanceId,
                attributes
              };
            }
          );
          observer.next(trackedEntityInstances);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  discoveringEnrollmentsFromServer(
    organisationUnitId: string,
    programId: string,
    syncStatus: string,
    currentUser: CurrentUser
  ): Observable<any> {
    const url = `/api/enrollments.json?ou=${organisationUnitId}&program=${programId}&paging=false`;
    return new Observable(observer => {
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        enrollmentResponse => {
          const enrollments = _.map(
            enrollmentResponse.enrollments,
            enrollmentObj => {
              const {
                trackedEntity,
                trackedEntityType,
                orgUnit,
                orgUnitName,
                program,
                enrollmentDate,
                incidentDate,
                trackedEntityInstance,
                enrollment,
                status
              } = enrollmentObj;
              const trackedEntityValue = trackedEntityType
                ? trackedEntityType
                : trackedEntity;
              const enrollmentPayload = this.enrollmentsProvider.getEnrollmentsPayLoad(
                trackedEntityValue,
                orgUnit,
                orgUnitName,
                program,
                enrollmentDate,
                incidentDate,
                trackedEntityInstance,
                syncStatus,
                enrollment,
                status
              )[0];
              return enrollmentPayload;
            }
          );
          observer.next(enrollments);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  discoveringEventsForTrackerFromServer(
    organisationUnitId: string,
    programId: string,
    eventType: string,
    syncStatus: string,
    programName: string,
    currentUser: CurrentUser
  ): Observable<any> {
    const url = `/events.json?program=${programId}&orgUnit=${organisationUnitId}&paging=false`;
    return new Observable(observer => {
      const attributeCc = '';
      const attributeCos = '';
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        eventReponse => {
          const events = _.map(eventReponse.events, eventObj => {
            const { event } = eventObj;
            return {
              ...eventObj,
              id: event,
              eventType,
              attributeCc,
              programName,
              attributeCategoryOptions: attributeCos,
              syncStatus
            };
          });
          observer.next(events);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  savingTrackedEntityInstances(
    trackedEntityInstances,
    enrollments,
    events,
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      const trackedEntityAttributeValues = _.flatMapDeep(
        _.map(
          trackedEntityInstances,
          trackedEntityInstance => trackedEntityInstance.attributes
        )
      );
      this.sqlLite
        .insertBulkDataOnTable(
          'trackedEntityInstances',
          trackedEntityInstances,
          currentUser.currentDatabase
        )
        .subscribe(
          () => {
            this.sqlLite
              .insertBulkDataOnTable(
                'trackedEntityAttributeValues',
                trackedEntityAttributeValues,
                currentUser.currentDatabase
              )
              .subscribe(
                () => {
                  this.sqlLite
                    .insertBulkDataOnTable(
                      'enrollments',
                      enrollments,
                      currentUser.currentDatabase
                    )
                    .subscribe(
                      () => {
                        this.sqlLite
                          .insertBulkDataOnTable(
                            'events',
                            events,
                            currentUser.currentDatabase
                          )
                          .subscribe(
                            () => {
                              observer.next();
                              observer.complete();
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
