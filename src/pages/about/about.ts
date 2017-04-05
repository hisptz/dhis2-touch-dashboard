import { Component,OnInit } from '@angular/core';

import { ToastController } from 'ionic-angular';
import {User} from "../../providers/user";
import {AppProvider} from "../../providers/app-provider";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage implements OnInit{

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public systemInformation : any = [];
  public appInformation : any;
  public dataValuesStorage : any = { online : 0,offline : 0};
  public eventsStorage : any = { online : 0,offline : 0};
  public hideAndShowObject : any = {
    systemInformation : {
      status : false,count : 4
    }
  };

  constructor(public user : User,public toastCtrl : ToastController,
              public appProvider : AppProvider) {
  }

  ngOnInit() {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.loadingSystemInformation();
    });
  }

  loadingSystemInformation(ionRefresher?){
    this.loadingData = true;
    this.loadingMessages = [];
    this.hideAndShowObject = {
      systemInformation : {
        status : false,count : 4
      }
    };
    this.setLoadingMessages('Loading system information');
    this.user.getCurrentUserSystemInformation().then(systemInformation=>{
      this.systemInformation = this.getArrayFromObject(systemInformation);
      this.loadAppInformation(ionRefresher);
    });
  }

  loadAppInformation(ionRefresher?){
    this.setLoadingMessages('Loading app information');
    this.appProvider.getAppInformation().then(appInformation=>{
      this.appInformation = this.getArrayFromObject(appInformation);
      if(ionRefresher){
        ionRefresher.complete();
      }
      this.loadingData = false;
    })
  }

  reLoadContents(ionRefresher){
    this.loadingSystemInformation(ionRefresher);
  }

  loadingMoreInformation(infiniteScroll,key,totalCount){
    if(this.hideAndShowObject[key].count != totalCount){
      setTimeout(() => {
        this.hideAndShowObject[key].count = totalCount;
        this.hideAndShowObject[key].status = !this.hideAndShowObject[key].status;
        infiniteScroll.complete();
      }, 500);
    }else{
      infiniteScroll.complete();
    }
  }

  getArrayFromObject(object){
    let array = [];
    for(let key in object){
      let newValue = object[key];
      if(newValue instanceof Object) {
        newValue = JSON.stringify(newValue)
      }
      let newKey = (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1').trim();
      array.push({key : newKey,value : newValue})
    }
    return array;
  }

  hideAndShowDetails(key,totalCount){
    if(this.hideAndShowObject[key].status){
      this.hideAndShowObject[key].count = 4;
    }else{
      this.hideAndShowObject[key].count = totalCount;
    }
    this.hideAndShowObject[key].status = !this.hideAndShowObject[key].status;
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
