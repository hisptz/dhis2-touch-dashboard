import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from "./http-client";

/*
  Generated class for the DashboardService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

export interface Dashboard {
  id: string;
  name: string;
  dashboardItems: Array<any>
}

@Injectable()
export class DashboardService {

  dashboards: Dashboard[];

  constructor(private httpClient : HttpClient) {
  }

  allDashboards(currentUser){
    let url = '/api/25/dashboards.json?paging=false&fields=id,name,dashboardItems[:all,users[:all],resources[:all],reports[:all]]';
    let self = this;
    return new Promise(function(resolve, reject) {
      if(self.dashboards && self.dashboards.length > 0){
        resolve(self.dashboards);
      }else{
        self.httpClient.get(url,currentUser).subscribe(response=>{
          self.dashboards = self.getDashboardsArrayFromApi(response.json());
          resolve(self.dashboards)
        },error=>{
          reject(error.json());
        })
      }
    });
  }

  getDashboardsArrayFromApi(dashboardsResponse){
    let dashboardsArray = [];
    if(dashboardsResponse && dashboardsResponse.dashboards){
      for(let dashboard of  dashboardsResponse.dashboards){
        dashboardsArray.push(dashboard);
      }
    }
    return dashboardsArray;
  }



}
