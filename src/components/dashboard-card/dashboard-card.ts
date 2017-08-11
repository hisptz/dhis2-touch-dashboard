import { Component,Input,Output,EventEmitter,OnInit } from '@angular/core';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";

/**
 * Generated class for the DashboardCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'dashboard-card',
  templateUrl: 'dashboard-card.html'
})
export class DashboardCardComponent implements OnInit{

  @Input() dashboardItem;
  @Input() dashboardId;
  @Output() dashboardItemAnalyticData = new EventEmitter();
  @Output() loadInFullScreen = new EventEmitter();

  currentUser : any;

  constructor(private userProvider : UserProvider,
              private appProvider : AppProvider,) {
  }


  ngOnInit() {
    this.userProvider.getCurrentUser().then((currentUser :any)=>{
      this.currentUser = currentUser;
      const vizualiationDetails = {
        dashboardItem: this.dashboardItem,
        dashboardId: this.dashboardId,
      }
    })
  }


}
