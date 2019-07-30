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
import { HTTP } from '@ionic-native/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs/Observable';
import { CurrentUser } from '../../models/current-user';
import { EncryptionProvider } from '../encryption/encryption';
import { NetworkAvailabilityProvider } from '../network-availability/network-availability';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import * as async from 'async';
/*
  Generated class for the HttpClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpClientProvider {
  constructor(
    private http: HTTP,
    private encryption: EncryptionProvider,
    public storage: Storage,
    private networkProvider: NetworkAvailabilityProvider
  ) {}

  /**
   *
   * @param url
   * @param user
   * @returns {any}
   */
  getUrlBasedOnDhisVersion(url, user) {
    if (url.indexOf('/api/') == -1 && url.indexOf('.json') > 0) {
      url = '/api/' + url;
    }
    if (user.dhisVersion && parseInt(user.dhisVersion) < 25) {
      let pattern = '/api/' + user.dhisVersion;
      url = url.replace(pattern, '/api/');
    } else if (user.dhisVersion && parseInt(user.dhisVersion) >= 25) {
      let pattern = '/api/' + user.dhisVersion;
      url = url.replace('/api', '/api');
      url = url.replace('/api', pattern);
    }
    return encodeURI(url);
  }

  /**
   *
   * @param user
   * @returns {Observable<any>}
   */
  getSanitizedUser(user: CurrentUser): Observable<any> {
    return new Observable(observer => {
      const { isAvailable } = this.networkProvider.getNetWorkStatus();
      if (isAvailable) {
        if (user) {
          let sanitizedUser = _.assign({}, user);
          if (user.isPasswordEncode) {
            sanitizedUser.password = this.encryption.decode(user.password);
          }
          observer.next(sanitizedUser);
          observer.complete();
        } else {
          this.storage.get('user').then(
            currentUser => {
              currentUser = JSON.parse(currentUser);
              if (currentUser.isPasswordEncode) {
                currentUser.password = this.encryption.decode(
                  currentUser.password
                );
              }
              observer.next(currentUser);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        }
      } else {
        observer.error({ error: 'network is not available' });
      }
    });
  }

  /**
   *
   * @param url
   * @param {boolean} dataOnly
   * @param user
   * @param resourceName
   * @param pageSize
   * @returns {Observable<any>}
   */
  get(
    url,
    dataOnly: boolean = false,
    user?,
    resourceName?,
    pageSize?
  ): Observable<any> {
    let apiUrl = '';
    return new Observable(observer => {
      this.getSanitizedUser(user).subscribe(
        (sanitizedUser: CurrentUser) => {
          apiUrl =
            sanitizedUser.serverUrl +
            this.getUrlBasedOnDhisVersion(url, sanitizedUser);
          const { username, password } = sanitizedUser;
          this.http.clearCookies();
          const headers = this.http.getBasicAuthHeader(username, password);
          if (resourceName && pageSize) {
            let promises = [];
            const testUrl =
              user.serverUrl +
              '/api/' +
              resourceName +
              '.json?fields=none&pageSize=' +
              pageSize;
            this.http
              .get(testUrl, {}, headers)
              .then((initialResponse: any) => {
                initialResponse = JSON.parse(initialResponse.data);
                if (initialResponse.pager.pageCount) {
                  initialResponse[resourceName] = [];
                  const paginatedUrls = [];
                  for (let i = 1; i <= initialResponse.pager.pageCount; i++) {
                    const paginatedUrl =
                      apiUrl + '&pageSize=' + pageSize + '&page=' + i;
                    paginatedUrls.push(paginatedUrl);
                  }
                  const that = this;
                  let completedStages = 0;
                  async.mapLimit(
                    paginatedUrls,
                    paginatedUrls.length,
                    async function(paginatedUrl) {
                      try {
                        let response = await that.http.get(
                          paginatedUrl,
                          {},
                          headers
                        );
                        response = JSON.parse(response.data);
                        initialResponse[resourceName] = initialResponse[
                          resourceName
                        ].concat(response[resourceName]);
                        completedStages++;
                        if (completedStages === paginatedUrls.length) {
                          observer.next(initialResponse);
                          observer.complete();
                        }
                      } catch (error) {
                        observer.error(error);
                      }
                    },
                    (error, results) => {
                      if (error) {
                        observer.error(error);
                      } else {
                        observer.next(initialResponse);
                        observer.complete();
                      }
                    }
                  );
                } else {
                  this.http
                    .get(url, {}, headers)
                    .then(
                      (response: any) => {
                        observer.next(response);
                        observer.complete();
                      },
                      error => {
                        observer.error(error);
                      }
                    )
                    .catch(error => {
                      observer.error(error);
                    });
                }
              })
              .catch(error => {
                observer.error(error);
              });
          } else {
            this.http
              .get(apiUrl, {}, headers)
              .then((response: any) => {
                if (dataOnly) {
                  observer.next(JSON.parse(response.data));
                } else {
                  observer.next(response);
                }
                observer.complete();
              })
              .catch(error => {
                observer.error(error);
              });
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param url
   * @param data
   * @param user
   * @returns {Observable<any>}
   */
  post(url, data, user?): Observable<any> {
    let apiUrl = '';
    return new Observable(observer => {
      this.getSanitizedUser(user).subscribe(
        (sanitizedUser: CurrentUser) => {
          const { username, password } = sanitizedUser;
          this.http.clearCookies();
          const headers = this.http.getBasicAuthHeader(username, password);
          this.http.setDataSerializer('json');
          apiUrl =
            user.serverUrl + this.getUrlBasedOnDhisVersion(url, sanitizedUser);
          this.http
            .post(apiUrl, data, headers)
            .then((response: any) => {
              observer.next(response);
              observer.complete();
            })
            .catch(error => {
              observer.error(error);
            });
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  put(url, data, user?): Observable<any> {
    let apiUrl = '';
    return new Observable(observer => {
      this.getSanitizedUser(user).subscribe(
        (sanitizedUser: CurrentUser) => {
          const { username, password } = sanitizedUser;
          this.http.clearCookies();
          const headers = this.http.getBasicAuthHeader(username, password);
          this.http.setDataSerializer('json');
          apiUrl =
            user.serverUrl + this.getUrlBasedOnDhisVersion(url, sanitizedUser);
          this.http
            .put(apiUrl, data, headers)
            .then((response: any) => {
              observer.next(response);
              observer.complete();
            })
            .catch(error => {
              observer.error(error);
            });
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param url
   * @param user
   * @returns {Observable<any>}
   */
  delete(url, user?): Observable<any> {
    let apiUrl = '';
    return new Observable(observer => {
      this.getSanitizedUser(user).subscribe(
        (sanitizedUser: CurrentUser) => {
          const { username, password } = sanitizedUser;
          this.http.clearCookies();
          const headers = this.http.getBasicAuthHeader(username, password);
          this.http.setDataSerializer('json');
          apiUrl =
            user.serverUrl + this.getUrlBasedOnDhisVersion(url, sanitizedUser);
          this.http
            .delete(apiUrl, {}, headers)
            .then((response: any) => {
              observer.next(response);
              observer.complete();
            })
            .catch(error => {
              observer.error(error);
            });
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
}
