import { Component,Input,Output,EventEmitter,OnInit } from '@angular/core';
import {UserProvider} from "../../providers/user/user";
import {VisualizationObjectServiceProvider} from '../../providers/visualization-object-service/visualization-object-service';
import {FavoriteServiceProvider} from '../../providers/favorite-service/favorite-service';
import {AnalyticsServiceProvider} from '../../providers/analytics-service/analytics-service';
import {Observable} from 'rxjs/Observable';
import {ChartServiceProvider} from '../../providers/chart-service/chart-service';
import {TableServiceProvider} from '../../providers/table-service/table-service';
import {MapServiceProvider} from '../../providers/map-service/map-service';
import {GeoFeatureServiceProvider} from '../../providers/geo-feature-service/geo-feature-service';
import {ResourceProvider} from "../../providers/resource/resource";
import * as _ from 'lodash';

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
  @Input() dashBoardCardClass;
  @Input() isInFullScreen;
  @Output() loadInFullScreen = new EventEmitter();

  currentUser : any;
  visualizationObject: any;
  isVisualizationDataLoaded: boolean;
  visualizationType: string;

  visualizationOptions : any;
  zoomIcon : string;
  filterIcon : string;

  constructor(private userProvider : UserProvider,
              private visualizationObjectService: VisualizationObjectServiceProvider,
              private favoriteService: FavoriteServiceProvider,
              private analyticsService: AnalyticsServiceProvider,
              private chartService: ChartServiceProvider,
              private tableService: TableServiceProvider,
              private mapService: MapServiceProvider,
              private resourceProvider : ResourceProvider,
              private geoFeatureService: GeoFeatureServiceProvider
              ) {

  }


  ngOnInit() {
    this.zoomIcon = 'assets/dashboard/full-screen.png';
    this.filterIcon = 'assets/dashboard/filter.png';
    this.visualizationOptions = this.resourceProvider.getVisualizationIcons().visualizationType;

    this.userProvider.getCurrentUser().then((currentUser :any)=>{
      this.currentUser = currentUser;
      const initialVisualizationObject = this.visualizationObjectService.loadInitialVisualizationObject(
        {
          dashboardItem: this.dashboardItem,
          dashboardId: this.dashboardId,
          currentUser: currentUser
        }
      );

      this.visualizationObject = initialVisualizationObject;
      this.isVisualizationDataLoaded = initialVisualizationObject.details.loaded;
      this.visualizationType = initialVisualizationObject.details.currentVisualization;

      this.favoriteService.getFavorite({
        visualizationObject: initialVisualizationObject,
        apiRootUrl: '/api/25/'
      },
        currentUser
      ).subscribe(favoriteResult => {
        if (favoriteResult) {
          /**
           * Extend visualization object with favorite
           * @type {any}
           */
          const visualizationObjectWithFavorite = this.extendVisualizationWithFavorite(
            initialVisualizationObject,
            favoriteResult.favorite,
            favoriteResult.error);

          const visualizationFilterResults = this.favoriteService.getVisualizationFiltersFromFavorite(favoriteResult);

          /**
           * Extend visualization object with filters
           */
          const visualizatiobObjectWithFilters = this.extendVisualizationObjectWithFilters(
            visualizationObjectWithFavorite,
            visualizationFilterResults.filters);

          const visualizationDetailsWithFiltersAndLayout = this.favoriteService.getVisualizationLayoutFromFavorite(
            visualizationFilterResults
          );

          /**
           * Extend visualization object with layouts
           */
          const visualizationObjectWithLayout = this.extendVisualizationObjectWithLayout(
            visualizatiobObjectWithFilters,
            visualizationDetailsWithFiltersAndLayout.layouts
          );

          if (visualizationDetailsWithFiltersAndLayout) {
            this.analyticsService.getAnalytics(
              visualizationDetailsWithFiltersAndLayout,
              currentUser
            ).subscribe(visualizationWithAnalytics => {

              /**
               * Extend visualization object with analytics
               */
              const visualizationObjectWithAnalytics = this.extendVisualizationWithAnalytics(
                visualizationObjectWithLayout,
                visualizationWithAnalytics.analytics
              )

              this.extendVisualizationObjectWithDrawingObjects(
                visualizationObjectWithAnalytics, currentUser
              ).subscribe((visualizatioObject: any) => {
                this.visualizationObject = visualizatioObject;
                this.isVisualizationDataLoaded = visualizatioObject.details.loaded;
              })
            })
          }

        }

      })
    })
  }

  loadFullScreenDashboard(){
    let data = {
      dashboardItem : this.dashboardItem,
      dashboardId : this.dashboardId
    };
    this.loadInFullScreen.emit(data);
  }

  extendVisualizationObjectWithLayout(visualizationObject: any, layouts: any) {
    const newVisualizationObject = _.clone(visualizationObject);
    const newVisualizationDetails = _.clone(newVisualizationObject.details);

    newVisualizationDetails.layouts = layouts;

    newVisualizationObject.details = _.assign({}, newVisualizationDetails);

    return newVisualizationObject;
  }

  extendVisualizationObjectWithFilters(visualizationObject: any, filters: any) {
    const newVisualizationObject = _.clone(visualizationObject);
    const newVisualizationDetails = _.clone(newVisualizationObject.details);

    newVisualizationDetails.filters = filters;

    newVisualizationObject.details = _.assign({}, newVisualizationDetails);

    return newVisualizationObject;
  }

  extendVisualizationWithFavorite(visualizationObject, favoriteObject, favoriteError) {
    const currentVisualizationObject: any = _.clone(visualizationObject);
    if (!favoriteError) {
      /**
       * Update visualization settings with favorite if no error
       */
      currentVisualizationObject.layers = this.mapFavoriteToLayerSettings(favoriteObject);

      if (favoriteObject) {
        /**
         * Also get map configuration if current visualization is map
         */
        if (currentVisualizationObject.details.currentVisualization === 'MAP') {
          currentVisualizationObject.details.basemap = favoriteObject.basemap;
          currentVisualizationObject.details.zoom = favoriteObject.zoom;
          currentVisualizationObject.details.latitude = favoriteObject.latitude;
          currentVisualizationObject.details.longitude = favoriteObject.longitude;
        }
      }
    } else {
      /**
       * Get error message
       */
      currentVisualizationObject.details.errorMessage = favoriteError;
      currentVisualizationObject.details.hasError = true;
      currentVisualizationObject.details.loaded = true;
    }

    return currentVisualizationObject;
  }

  mapFavoriteToLayerSettings(favoriteObject: any) {
    if (favoriteObject.mapViews) {
      return _.map(favoriteObject.mapViews, (view: any) => {
        return {settings: view}
      });
    }
    return [{settings: favoriteObject}];
  }

  extendVisualizationWithAnalytics(visualizationObject: any, loadedAnalytics: any[]) {
    const newVisualizationObject: any = _.clone(visualizationObject);
    /**
     * Update visualization layer with analytics
     */
    newVisualizationObject.layers = _.map(newVisualizationObject.layers, (layer: any) => {
      const newLayer = _.clone(layer);
      const newSettings = newLayer ? newLayer.settings : null;
      const analyticsObject = _.find(loadedAnalytics, ['id', newSettings !== null ? newSettings.id : '']);
      if (analyticsObject) {
        newLayer.analytics = Object.assign({}, analyticsObject.content);
      }
      return newLayer;
    });

    return newVisualizationObject;
  }

  extendVisualizationObjectWithDrawingObjects(currentVisualizationObject: any, currentUser) {
    const currentVisualization: string = currentVisualizationObject.details.currentVisualization;
    const newVisualizationObject = _.clone(currentVisualizationObject);
    return Observable.create(observer => {
      if (currentVisualization === 'CHART') {
        const mergeVisualizationObject = this.visualizationObjectService.mergeVisualizationObject(newVisualizationObject);
        /**
         * Update visualization layers with chart configuration
         */
        const visualizationObjectLayersWithChartConfiguration = _.map(mergeVisualizationObject.layers, (layer, layerIndex) => {
          const newLayer = _.clone(layer);
          const newSettings = _.clone(layer.settings);
          newSettings.chartConfiguration = _.assign({}, this.chartService.getChartConfiguration1(
            newSettings,
            mergeVisualizationObject.id + '_' + layerIndex,
            mergeVisualizationObject.details.layouts
          ));
          newLayer.settings = _.assign({}, newSettings);
          return newLayer;
        });

        /**
         * Update visualization layers with chart object
         */
        const visualizationObjectLayersWithChartObject = _.map(visualizationObjectLayersWithChartConfiguration, (layer) => {
          const newLayer = _.clone(layer);
          newLayer.chartObject = _.assign({}, this.chartService.getChartObject(newLayer.analytics, newLayer.settings.chartConfiguration));
          return newLayer;
        });

        newVisualizationObject.layers = _.assign([], visualizationObjectLayersWithChartObject);

        newVisualizationObject.details.loaded = true;
        observer.next(newVisualizationObject);
        observer.complete();

      } else if (currentVisualization === 'TABLE') {
        const mergeVisualizationObject = this.visualizationObjectService.mergeVisualizationObject(newVisualizationObject);

        /**
         * Update visualization layers with table configuration
         */
        const visualizationObjectLayersWithTableConfiguration = _.map(mergeVisualizationObject.layers, (layer, layerIndex) => {
          const newLayer = _.clone(layer);
          const newSettings = _.clone(layer.settings);
          newSettings.tableConfiguration = _.assign({}, this.tableService.getTableConfiguration1(
            newSettings,
            mergeVisualizationObject.details.layouts,
            mergeVisualizationObject.type
          ));
          newLayer.settings = _.assign({}, newSettings);
          return newLayer;
        });

        /**
         * Update visualization layers with table object
         */
        const visualizationObjectLayersWithChartObject = _.map(visualizationObjectLayersWithTableConfiguration, (layer) => {
          const newLayer = _.clone(layer);
          newLayer.tableObject = _.assign({}, this.tableService.getTableObject(newLayer.analytics,newLayer.settings, newLayer.settings.tableConfiguration));
          return newLayer;
        });

        newVisualizationObject.layers = _.assign([], visualizationObjectLayersWithChartObject);
        newVisualizationObject.details.loaded = true;
        observer.next(newVisualizationObject);
        observer.complete();
      } else if (currentVisualization === 'MAP') {
        const splitedVisualizationObject = newVisualizationObject.details.type !== 'MAP' ?
          this.visualizationObjectService.splitVisualizationObject(newVisualizationObject) :
          _.clone(newVisualizationObject);


        const newVisualizationDetails = _.clone(splitedVisualizationObject.details);

        /**
         * Update with map configuration
         */
        newVisualizationDetails.mapConfiguration = _.assign({}, this.mapService.getMapConfiguration(splitedVisualizationObject));


        /**
         * Update with geo features
         */
        this.geoFeatureService.getGeoFeature({
          apiRootUrl: '/api/25/',
          visualizationObject: splitedVisualizationObject
        }, currentUser).subscribe((geoFeatureResponse: any) => {

          if (geoFeatureResponse.geoFeatures) {
            splitedVisualizationObject.layers = _.map(splitedVisualizationObject.layers, (layer: any) => {
              const newLayer = _.clone(layer);
              const newSettings = _.clone(layer.settings);
              const availableGeoFeatureObject: any = _.find(geoFeatureResponse.geoFeatures, ['id', newSettings.id]);

              if (availableGeoFeatureObject) {
                if (availableGeoFeatureObject.content.length === 0) {
                  // newVisualizationDetails.hasError = true;
                  // newVisualizationDetails.errorMessage = 'Coordinates for displaying a map are missing';
                } else {
                  newSettings.geoFeature = _.assign([], availableGeoFeatureObject.content);
                }
              }
              newLayer.settings = _.assign({}, newSettings);

              return newLayer;
            });
          }

          newVisualizationDetails.loaded = true;
          splitedVisualizationObject.details = _.assign({}, newVisualizationDetails);
          observer.next(splitedVisualizationObject);
          observer.complete();
        })
      } else {
        newVisualizationObject.details.loaded = true;
        observer.next(newVisualizationObject);
        observer.complete();
      }
    })
  }


}
