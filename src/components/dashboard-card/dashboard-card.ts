import { Component,Input,Output,EventEmitter,OnInit } from '@angular/core';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {VisualizationObjectServiceProvider} from '../../providers/visualization-object-service/visualization-object-service';
import {FavoriteServiceProvider} from '../../providers/favorite-service/favorite-service';

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
  visualizationObject: any;
  constructor(private userProvider : UserProvider,
              private appProvider : AppProvider,
              private visualizationObjectService: VisualizationObjectServiceProvider,
              private favoriteService: FavoriteServiceProvider
              ) {
  }


  ngOnInit() {
    this.userProvider.getCurrentUser().then((currentUser :any)=>{
      this.currentUser = currentUser;
      const initialVisualizationObject = this.visualizationObjectService.loadInitialVisualizationObject(
        {
          dashboardItem: this.dashboardItem,
          dashboardId: this.dashboardId,
          currentUser: currentUser
        }
      );

      this.favoriteService.getFavorite({
        visualizationObject: initialVisualizationObject,
        apiRootUrl: currentUser.serverUrl
      }, currentUser).subscribe(favoriteResult => {
        console.log(favoriteResult)
      })
    })
  }


}
