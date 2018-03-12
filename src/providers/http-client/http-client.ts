import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../store/reducers/index';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '../../store/selectors/currentUser.selectors';
import { CurrentUser } from '../../models/currentUser';
import { EncryptionProvider } from '../encryption/encryption';
import * as _ from 'lodash';
import { NetworkAvailabilityProvider } from '../network-availability/network-availability';

/*
  Generated class for the HttpClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpClientProvider {
  public timeOutTime: number;
  constructor(
    private http: HTTP,
    private store: Store<ApplicationState>,
    private encryption: EncryptionProvider,
    private defaultHttp: Http,
    private networkProvider: NetworkAvailabilityProvider
  ) {
    this.timeOutTime = 2 * 60 * 1000;
  }

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
      //removing hardcorded /api/25 on all apps urls
      let pattern = '/api/' + user.dhisVersion;
      url = url.replace('/api/25', pattern);
    }
    return url;
  }

  /**
   *
   * @param user
   * @returns {Observable<any>}
   */
  getSanitizedUser(user): Observable<any> {
    return new Observable(observer => {
      const { isAvailable } = this.networkProvider.getNetWorkStatus();
      if (isAvailable) {
        if (!user) {
          this.store.select(getCurrentUser).subscribe(
            (currentUser: CurrentUser) => {
              user = _.assign({}, currentUser);
              user.password = this.encryption.decode(user.password);
              observer.next(user);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        } else {
          observer.next(user);
          observer.complete();
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
          this.http.useBasicAuth(
            sanitizedUser.username,
            sanitizedUser.password
          );
          this.http.setRequestTimeout(this.timeOutTime);
          if (resourceName && pageSize) {
            let promises = [];
            let testUrl =
              user.serverUrl +
              '/api/' +
              resourceName +
              '.json?fields=none&pageSize=' +
              pageSize;
            this.http
              .get(testUrl, {}, {})
              .then(
                (initialResponse: any) => {
                  initialResponse = JSON.parse(initialResponse.data);
                  if (initialResponse.pager.pageCount) {
                    initialResponse[resourceName] = [];
                    for (let i = 1; i <= initialResponse.pager.pageCount; i++) {
                      let paginatedUrl =
                        apiUrl + '&pageSize=' + pageSize + '&page=' + i;
                      promises.push(
                        this.http
                          .get(paginatedUrl, {}, {})
                          .then((response: any) => {
                            response = JSON.parse(response.data);
                            initialResponse[resourceName] = initialResponse[
                              resourceName
                            ].concat(response[resourceName]);
                          })
                          .catch(error => {})
                      );
                    }
                    Observable.forkJoin(promises).subscribe(
                      () => {
                        observer.next(initialResponse);
                        observer.complete();
                      },
                      error => {
                        observer.error(error);
                      }
                    );
                  } else {
                    this.http
                      .get(url, {}, {})
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
                },
                error => {
                  observer.error(error);
                }
              )
              .catch(error => {
                observer.error(error);
              });
          } else {
            this.http
              .get(apiUrl, {}, {})
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
          this.http.useBasicAuth(
            sanitizedUser.username,
            sanitizedUser.password
          );
          this.http.setRequestTimeout(this.timeOutTime);
          apiUrl =
            user.serverUrl + this.getUrlBasedOnDhisVersion(url, sanitizedUser);
          this.http
            .post(apiUrl, data, {})
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
  defaultPost(url, data, user?): Observable<any> {
    let apiUrl = '';
    return new Observable(observer => {
      this.getSanitizedUser(user).subscribe(
        (sanitizedUser: CurrentUser) => {
          apiUrl =
            sanitizedUser.serverUrl +
            this.getUrlBasedOnDhisVersion(url, sanitizedUser);
          let headers = new Headers();
          headers.append(
            'Authorization',
            'Basic ' + sanitizedUser.authorizationKey
          );
          this.defaultHttp
            .post(apiUrl, data, { headers: headers })
            .timeout(this.timeOutTime)
            .subscribe(
              (response: any) => {
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
    });
  }

  /**
   *
   * @param url
   * @param data
   * @param user
   * @returns {Observable<any>}
   */
  put(url, data, user?): Observable<any> {
    return new Observable(observer => {
      this.getSanitizedUser(user).subscribe(
        (sanitizedUser: CurrentUser) => {
          url = this.getUrlBasedOnDhisVersion(url, sanitizedUser);
          let headers = new Headers();
          headers.append(
            'Authorization',
            'Basic ' + sanitizedUser.authorizationKey
          );
          this.defaultHttp
            .put(sanitizedUser.serverUrl + url, data, { headers: headers })
            .timeout(this.timeOutTime)
            .map(res => res.json())
            .subscribe(
              response => {
                observer.next(response);
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
    });
  }

  /**
   *
   * @param url
   * @param user
   * @returns {Observable<any>}
   */
  delete(url, user?): Observable<any> {
    return new Observable(observer => {
      this.getSanitizedUser(user).subscribe(
        (sanitizedUser: CurrentUser) => {
          url = this.getUrlBasedOnDhisVersion(url, sanitizedUser);
          let headers = new Headers();
          headers.append(
            'Authorization',
            'Basic ' + sanitizedUser.authorizationKey
          );
          this.defaultHttp
            .delete(sanitizedUser.serverUrl + url, { headers: headers })
            .timeout(this.timeOutTime)
            .map(res => res.json())
            .subscribe(
              response => {
                observer.next(response);
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
    });
  }
}
