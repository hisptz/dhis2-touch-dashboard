import { Component,OnInit } from '@angular/core';
import { NavController,ToastController,MenuController } from 'ionic-angular';
import {User} from "../../providers/user";
import {HttpClient} from "../../providers/http-client";
import {AppProvider} from "../../providers/app-provider";
import {SqlLite} from "../../providers/sql-lite";
import {DashBoardHomePage} from "../dash-board-home/dash-board-home";

/*
 Generated class for the Login page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit{

  public loginData : any ={};
  public loadingData : boolean = false;
  public isLoginProcessActive :boolean = false;
  public loadingMessages : any = [];
  public logoUrl : string;

  //progress tracker object
  public progress : string = "0";
  public progressTracker : any;
  public completedTrackedProcess : any;
  public currentResourceType : string = "";

  constructor(public navCtrl: NavController,public menuCtrl: MenuController,
              public toastCtrl: ToastController,public app : AppProvider,
              public httpClient : HttpClient,
              public user : User,public sqlLite : SqlLite) {}

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.logoUrl = 'assets/img/logo-2.png';
    this.completedTrackedProcess = [];
    this.user.getCurrentUser().then((user: any)=>{
      if(user){
        this.loginData = user
      }
      this.reInitiateProgressTrackerObject(this.loginData);
    });
  }


  reInitiateProgressTrackerObject(user){
    if(user.progressTracker && user.currentDatabase && user.progressTracker[user.currentDatabase]){
      this.progressTracker = user.progressTracker[user.currentDatabase];
      this.resetPassSteps();
    }else{
      this.loginData["progressTracker"] = {};
      this.progressTracker = {};
      this.progressTracker = this.getEmptyProgressTracker();
    }
  }

  resetPassSteps(){
    let dataBaseStructure =  this.sqlLite.getDataBaseStructure();
    this.progressTracker["communication"].passStepCount = 0;
    Object.keys(dataBaseStructure).forEach(key=>{
      let table = dataBaseStructure[key];
      if(table.canBeUpdated && table.resourceType){
        if(this.progressTracker[table.resourceType]){
          this.progressTracker[table.resourceType].passStepCount = 0;
          this.progressTracker[table.resourceType].passStep.forEach((passStep : any)=>{
            passStep.hasPassed = false;
          })
        }
      }
    });
  }

  getEmptyProgressTracker(){
    let dataBaseStructure =  this.sqlLite.getDataBaseStructure();
    let progressTracker = {};
    Object.keys(dataBaseStructure).forEach(key=>{
      let table = dataBaseStructure[key];
      if(table.canBeUpdated && table.resourceType){
        if(!progressTracker[table.resourceType]){
          progressTracker[table.resourceType] = {count : 1,passStep :[],passStepCount : 0};
        }else{
          progressTracker[table.resourceType].count += 1;
        }
      }
    });
    progressTracker["communication"] = {count : 3,passStep :[],passStepCount : 0};
    progressTracker["finalization"] = {count :0.5,passStep :[],passStepCount : 0};
    return progressTracker;
  }

  updateProgressTracker(resourceName){
    let dataBaseStructure =  this.sqlLite.getDataBaseStructure();
    let resourceType = "communication";
    if(dataBaseStructure[resourceName]){
      let table = dataBaseStructure[resourceName];
      if(table.canBeUpdated && table.resourceType){
        resourceType = table.resourceType
      }
    }

    if(this.progressTracker[resourceType].passStep.length == this.progressTracker[resourceType].count){
      this.progressTracker[resourceType].passStep.forEach((passStep:any)=>{
        if(passStep.name == resourceName && passStep.hasDownloaded){
          passStep.hasPassed = true;
        }
      });
    }else{
      this.progressTracker[resourceType].passStep.push({name : resourceName,hasDownloaded : true,hasPassed : true});
    }
    this.progressTracker[resourceType].passStepCount = this.progressTracker[resourceType].passStepCount + 1;
    this.loginData["progressTracker"][this.loginData.currentDatabase] = this.progressTracker;
    this.user.setCurrentUser(this.loginData).then(()=>{});
    this.completedTrackedProcess = this.getCompletedTrackedProcess();
    this.updateProgressBarPercentage();
  }

  updateProgressBarPercentage(){
    let total = 0; let completed = 0;
    Object.keys(this.progressTracker).forEach(key=>{
      let process = this.progressTracker[key];
      process.passStep.forEach((passStep : any)=>{
        if(passStep.name && passStep.hasPassed){
          completed = completed + 1;
        }
      });
      total += process.count;
    });
    let value = (completed/total) * 100;
    this.progress = value.toFixed(2);
  }

  getCompletedTrackedProcess(){
    let completedTrackedProcess = [];
    Object.keys(this.progressTracker).forEach(key=>{
      let process = this.progressTracker[key];
      process.passStep.forEach((passStep : any)=>{
        if(passStep.name && passStep.hasDownloaded){
          if(completedTrackedProcess.indexOf(passStep.name) == -1){
            completedTrackedProcess.push(passStep.name);
          }
        }
      });
    });
    return completedTrackedProcess;
  };

  login() {
    if (this.loginData.serverUrl) {
      if (!this.loginData.username) {
        this.setToasterMessage('Please Enter username');
      } else if (!this.loginData.password) {
        this.setToasterMessage('Please Enter password');
      } else {
        let resource = "Authenticating user";
        this.progress = "0";
        //empty communication as well as organisation unit
        this.progressTracker.communication.passStep = [];
        this.currentResourceType = "communication";
        this.loadingData = true;
        this.isLoginProcessActive = true;
        this.app.getFormattedBaseUrl(this.loginData.serverUrl)
          .then(formattedBaseUrl => {
            this.loginData.serverUrl = formattedBaseUrl;
            this.user.authenticateUser(this.loginData).then((response:any)=> {
              response = this.getResponseData(response);
              this.loginData = response.user;
              //set authorization key and reset password
              this.loginData.authorizationKey = btoa(this.loginData.username + ':' + this.loginData.password);

              this.user.setUserData(JSON.parse(response.data)).then(userData=>{
                this.app.getDataBaseName(this.loginData.serverUrl).then(databaseName=>{
                  //update authenticate  process
                  this.loginData.currentDatabase = databaseName;
                  this.reInitiateProgressTrackerObject(this.loginData);
                  this.updateProgressTracker(resource);

                  resource = 'Opening database';
                  this.currentResourceType = "communication";
                  this.sqlLite.generateTables(databaseName).then(()=>{
                    this.updateProgressTracker(resource);
                    resource = 'Loading system information';
                    this.currentResourceType = "communication";
                    this.httpClient.get('/api/system/info',this.loginData).subscribe(
                      data => {
                        data = data.json();
                        this.updateProgressTracker(resource);
                        this.user.setCurrentUserSystemInformation(data).then(()=>{
                          this.setLandingPage();
                        },error=>{
                          this.loadingData = false;
                          this.isLoginProcessActive = false;
                          this.setLoadingMessages('Fail to set system information');
                        });
                      },error=>{
                        this.loadingData = false;
                        this.isLoginProcessActive = false;
                        this.setLoadingMessages('Fail to load system information');
                      });

                  },error=>{
                    this.setToasterMessage('Fail to open database.');
                  })
                })
              });
            }, error=> {
              this.loadingData = false;
              this.isLoginProcessActive = false;
              if (error.status == 0) {
                this.setToasterMessage("Please check your network connection");
              } else if (error.status == 401) {
                this.setToasterMessage('You have enter wrong username or password');
              } else {
                this.setToasterMessage('Please check server url');
              }
            });
          });
      }
    } else {
      this.setToasterMessage('Please Enter server url');
    }
  }

  getResponseData(response){
    if(response.data.data){
      return this.getResponseData(response.data);
    }else{
      return response;
    }
  }


  setLandingPage(){
    this.loginData.isLogin = true;
    this.loginData.password = "";
    this.user.setCurrentUser(this.loginData).then(()=>{
      this.navCtrl.setRoot(DashBoardHomePage);
      this.loadingData = false;
      this.isLoginProcessActive = false;
    });
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

  setNotificationToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      position : 'top',
      duration: 1500
    });
    toast.present();
  }

}
