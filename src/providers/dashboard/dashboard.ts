import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import {Dashboard} from "../../model/dashboard";
import {HttpClientProvider} from "../http-client/http-client";
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the DashboardProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DashboardProvider {

  constructor(private http : HttpClientProvider) {}

  loadAll(currentUser): Observable<any> {
    return Observable.create(observer => {
      let url = '/api/25/dashboards.json?fields=id,name,publicAccess,access,externalAccess,userGroupAccesses,dashboardItems[id,type,created,shape,appKey,reports[id,displayName],chart[id,displayName],map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName],resources[id,displayName],users[id,displayName]&paging=false';
      this.http.get(url,currentUser)
        .then((dashboardResponse : any) => {
          dashboardResponse = JSON.parse(dashboardResponse.data);
          observer.next(dashboardResponse);
          observer.complete();
        }, error => {
          observer.next(error);
          observer.complete();
        });
    });
  }



}
