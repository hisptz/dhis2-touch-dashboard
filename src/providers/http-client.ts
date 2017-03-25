import { Injectable } from '@angular/core';
import { Http ,Headers,Response} from '@angular/http';
import   'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs/Rx';

/*
 Generated class for the HttpClient provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class HttpClient {

  public timeOutTime : number;
  constructor(private http:Http) {
    this.timeOutTime = 4*60*1000;
  }

  /**
   *
   * @param url
   * @param user
   * @returns {any}
     */
  get(url,user):Observable<Response>{
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return this.http.get(user.serverUrl + url, {headers: headers}).timeout(this.timeOutTime);
  }

  /**
   *
   * @param url
   * @param data
   * @param user
   * @returns {any}
     */
  post(url, data, user):Observable<Response> {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return this.http.post(user.serverUrl + url, data, { headers: headers }).timeout(this.timeOutTime);
  }

  /**
   *
   * @param url
   * @param data
   * @param user
   * @returns {any}
     */
  put(url, data, user):Observable<Response> {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return this.http.put(user.serverUrl + url, data, { headers: headers }).timeout(this.timeOutTime);
  }

  /**
   *
   * @param url
   * @param user
   * @returns {any}
     */
  delete(url,user):Observable<Response> {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return this.http.delete(user.serverUrl + url,{headers: headers}).timeout(this.timeOutTime);
  }

}

