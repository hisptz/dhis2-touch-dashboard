import { Component, OnInit} from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {DashboardServiceProvider} from "../../providers/dashboard-service/dashboard-service";

/**
 * Generated class for the InteractiveDashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-interactive-dashboard',
  templateUrl: 'interactive-dashboard.html',
})
export class InteractiveDashboardPage implements OnInit{

  dashboardItem : any;
  dashboardItemData : any;
  analyticData : any;

  constructor(private DashboardServiceProvider : DashboardServiceProvider) {
  }

  ngOnInit(){
    let data = this.DashboardServiceProvider.getCurrentFullScreenVisualizationData();
    this.analyticData = data.analyticData;
    this.dashboardItemData = data.dashboardItemData;
    this.dashboardItem = data.dashboardItem
  }


}
