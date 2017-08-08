import { Injectable } from '@angular/core';
import {AppProvider} from "../app/app";

/*
  Generated class for the AboutProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AboutProvider {

  constructor(private appProvider : AppProvider) {
  }


  getAppInformation(){
    let appInformation = {name : '',version : '',package : ''};
    return new Promise((resolve, reject) => {
      this.appProvider.getAppInformation().then((response : any)=>{
        appInformation.name = response.appName;
        appInformation.version = response.versionNumber;
        appInformation.package = response.packageName;
        resolve(appInformation);
      },error=>{
        reject(error);
      });
    });
  }

  getAboutContentDetails(){
    let syncContents = [
      {id : 'appInformation',name : 'App information',icon: 'assets/about-icons/'},
      {id : 'dataValues',name : 'Data values',icon: 'assets/about-icons/'},
      {id : 'eventStatus',name : 'Event storage status',icon: 'assets/about-icons/'},
      {id : 'systemInfo',name : 'System info',icon: 'assets/about-icons/'},
    ];
    return syncContents;
  }





}
