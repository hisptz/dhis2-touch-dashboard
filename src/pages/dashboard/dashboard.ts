import { Component,OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers/user";
import {DashboardService} from "../../providers/dashboard-service";
import {Dashboard} from "../../providers/dashboard";

/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit{

  public isLoading : boolean = false;
  public loadingMessage : string = "";
  public currentUser : any;
  public dashboards : Array<Dashboard>;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public user : User,public DashboardService : DashboardService

               ) {}

  ngOnInit() {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.getAllDashboards(this.currentUser);
    });
  }

  ionViewDidEnter(){

  }

  getAllDashboards(currentUser){
    this.isLoading = true;
    this.loadingMessage = "Loading dashboards";
    this.DashboardService.allDashboards(currentUser).then((dashboards : Array<Dashboard>)=>{
      this.dashboards = dashboards;
      this.isLoading = false;
    },error=>{
      this.isLoading = false;
    });
  }



}
