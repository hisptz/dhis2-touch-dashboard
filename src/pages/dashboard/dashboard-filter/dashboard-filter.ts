import { Component , OnInit} from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';


/**
 * Generated class for the DashboardFilterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dashboard-filter',
  templateUrl: 'dashboard-filter.html',
})
export class DashboardFilterPage implements OnInit{

  public dashboards :any = [];
  public dashboardsCopy :any = [];


  constructor(public viewCtrl: ViewController) {
  }

  ngOnInit() {
    //loading dashboards from store;
  }

  getFilteredList(event: any) {
    let searchValue = event.target.value;
    this.dashboards = this.dashboardsCopy;
    if(searchValue && searchValue.trim() != ''){
      this.dashboards = this.dashboards.filter((dashboard:any) => {
        return (dashboard.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
      })
    }
  }

  setCurrentDashboard(selectedDashboard){
    this.viewCtrl.dismiss(selectedDashboard);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
