import { Component, OnInit} from '@angular/core';
import { IonicPage, ModalController, MenuController } from 'ionic-angular';
import {NetworkAvailabilityProvider} from "../../providers/network-availability/network-availability";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {DashboardProvider} from "../../providers/dashboard/dashboard";

/**
 * Generated class for the DashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit{

  currentUser:any;
  loadingMessage:string;
  isLoading:boolean;
  isDashboardItemsLoading:boolean;

  currentDashboardName:string;
  currentDashboardId:string;
  dashboards:any = [];
  dashBoardToDashboardItem:any = {};
  dashBoardItemObjectsAndData:any = {};
  dashBoardVisualizationData:any = {};
  openedDashboardIds:any = {};

  emptyListMessage : any;

  constructor(public modalCtrl:ModalController,
              private appProvider:AppProvider, private userProvider:UserProvider,
              private DashboardService: DashboardProvider,
              private NetworkAvailability:NetworkAvailabilityProvider,
              private menu:MenuController) {
  }

  ngOnInit() {
    this.menu.enable(true);
    this.isLoading = true;
    this.loadingMessage = "Loading current user information";
    this.userProvider.getCurrentUser().then(currentUser=> {
      this.userProvider.getUserData().then((userData :any)=>{
        //todo user org unit
        this.currentUser = currentUser;
        this.loadingListOfAllDashboards(currentUser)
      },error=>{})
      ;
    }, error=> {
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to loading current user information");
    });
  }


  loadingListOfAllDashboards(currentUser) {
    this.isLoading = true;
    let network = this.NetworkAvailability.getNetWorkStatus();
    this.currentDashboardName = '';
    this.currentDashboardId = '';
    if (network.isAvailable) {
      this.loadingMessage = "Loading dashboards";
      this.dashboards = [];
      this.DashboardService.loadAll(currentUser).subscribe((dashboards: any)=>{
        this.dashboards = dashboards;
        if (dashboards.length > 0) {
          this.currentDashboardName = dashboards[0].name;
          for (let dashboard of  dashboards) {
            this.dashBoardToDashboardItem[dashboard.id] = dashboard.dashboardItems;
          }
          //this.getDashboardItemObjectsAndData(dashboards[0].dashboardItems, dashboards[0].id);
        } else {
          this.currentDashboardName = "No dashboard found";
          this.emptyListMessage = "No dashboard found from server";
        }
        this.isLoading = false;

      },error=>{
        this.isLoading = false;
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification('Fail to load dashboards');
      });
    } else {
      //there is no network available
      this.isLoading = false;
      this.appProvider.setNormalNotification(network.message);
    }
  }

  openDashboardListFilter() {
    if (this.dashboards.length > 0) {
      this.isLoading = true;
      this.loadingMessage = "Please wait ...";
      let modal = this.modalCtrl.create('DashboardFilterPage', {
        currentDashboardName: this.currentDashboardName,
        currentUser: this.currentUser
      });
      modal.onDidDismiss((dashboard:any)=> {
        this.isLoading = false;
        this.loadingMessage = "";
        if (dashboard && dashboard.name) {
          if (dashboard.name != this.currentDashboardName) {
            this.currentDashboardName = dashboard.name;
            let selectedDashboards = this.dashBoardToDashboardItem[dashboard.id];
            //this.getDashboardItemObjectsAndData(selectedDashboards, dashboard.id);
          }
        }
      });
      modal.present();
    }
  }

  reLoadDashBoard(refresher){
    this.DashboardService.resetDashboards();
    this.loadingListOfAllDashboards(this.currentUser);
    refresher.complete();
  }

}
