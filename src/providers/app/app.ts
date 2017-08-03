import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ToastController} from 'ionic-angular';

/*
  Generated class for the AppProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AppProvider {



  constructor(private  appVersion: AppVersion,private toastController : ToastController) {
  }

  /**
   *
   * @param message
     */
  setTopNotification(message){
    this.toastController.create({
      message: message,
      position : 'top',
      duration: 4500
    }).present();
  }

  /**
   *
   * @param message
     */
  setNormalNotification(message){
    this.toastController.create({
      message: message,
      position : 'bottom',
      duration: 5000
    }).present();
  }


  /**
   *
   * @returns {Promise<T>}
     */
  getAppInformation(){
    let appInformation = {};
    let promises = [];
    let self = this;

    return new Promise(function(resolve, reject) {
      promises.push(
        self.appVersion.getAppName().then(appName=>{
          appInformation['appName'] = appName;
        })
      );
      promises.push(
        self.appVersion.getPackageName().then(packageName=>{
          appInformation['packageName'] = packageName;
        })
      );
      promises.push(
        self.appVersion.getVersionCode().then(versionCode=>{
          appInformation['versionCode'] = versionCode;
        })
      );
      promises.push(
        self.appVersion.getVersionNumber().then(versionNumber=>{
          appInformation['versionNumber'] = versionNumber;
        })
      );

      Observable.forkJoin(promises).subscribe(() => {
          resolve(appInformation);
        },
        (error) => {
          reject();
        })
    });
  }

  getDataBaseName(url){
    let databaseName = url.replace('://', '_').replace(/[/\s]/g, '_').replace(/[.\s]/g, '_').replace(/[:\s]/g, '_');
    return databaseName
  }

  /**
   *
   * @param url
   * @returns {string}
     */
  getFormattedBaseUrl(url){
    let formattedBaseUrl = "";
    let urlToBeFormatted : string ="",urlArray : any =[],baseUrlString : any;
    if (!(url.split('/')[0] == "https:" || url.split('/')[0] == "http:")) {
      urlToBeFormatted = "http://" + url;
    } else {
      urlToBeFormatted = url;
    }
    baseUrlString = urlToBeFormatted.split('/');
    for(let index in baseUrlString){
      if (baseUrlString[index]) {
        urlArray.push(baseUrlString[index]);
      }
    }
    formattedBaseUrl = urlArray[0] + '/';
    for (let i =0; i < urlArray.length; i ++){
      if(i != 0){
        formattedBaseUrl = formattedBaseUrl + '/' + urlArray[i];
      }
    }

    formattedBaseUrl = this.getUrlWithLowercaseDomain(formattedBaseUrl);
    return formattedBaseUrl;
  }

  getUrlWithLowercaseDomain(formattedBaseUrl){
    let baseUrlArray = formattedBaseUrl.split("://");

    if(baseUrlArray.length > 0){
      let domainName = baseUrlArray[1].split("/")[0];
      let lowerCaseDomain = baseUrlArray[1].split("/")[0].toLowerCase();
      formattedBaseUrl = formattedBaseUrl.replace(domainName,lowerCaseDomain)
    }
    return formattedBaseUrl
  }
}
