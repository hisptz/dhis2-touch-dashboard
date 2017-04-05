import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from "./http-client";

/*
 Generated class for the DashboardService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

export interface Dashboard {
  id: string;
  name: string;
  dashboardItems: Array<any>
}

@Injectable()
export class DashboardService {

  dashboards:Dashboard[];

  constructor(private httpClient:HttpClient) {
  }

  /**
   * get all dashboards
   * @param currentUser
   * @returns {Promise<T>}
   */
  allDashboards(currentUser) {
    let url = '/api/25/dashboards.json?paging=false&fields=id,name,dashboardItems[:all,users[:all],resources[:all],reports[:all]]';
    let self = this;
    return new Promise(function (resolve, reject) {
      if (self.dashboards && self.dashboards.length > 0) {
        resolve(self.dashboards);
      } else {
        self.httpClient.get(url, currentUser).subscribe(response=> {
          self.dashboards = self.getDashboardsArrayFromApi(response.json());
          resolve(self.dashboards)
        }, error=> {
          reject(error.json());
        })
      }
    });
  }

  /**
   * get formatted dashboards as array
   * @param dashboardsResponse
   * @returns {Array}
   */
  getDashboardsArrayFromApi(dashboardsResponse) {
    let dashboardsArray = [];
    if (dashboardsResponse && dashboardsResponse.dashboards) {
      for (let dashboard of  dashboardsResponse.dashboards) {
        dashboardsArray.push(dashboard);
      }
    }
    return dashboardsArray;
  }

  /**
   * get formatted string neccessry for anlaytic
   * @param enumString
   * @returns {any}
   */
  formatEnumString(enumString) {
    enumString = enumString.replace(/_/g, ' ');
    enumString = enumString.toLowerCase();
    return enumString.substr(0, 1) + enumString.replace(/(\b)([a-zA-Z])/g,
        function (firstLetter) {
          return firstLetter.toUpperCase();
        }).replace(/ /g, '').substr(1);
  }


  /**
   * getDashBoardItemObjects
   * @param dashboardItems
   * @param currentUser
   * @returns {Promise<T>}
   */
  getDashBoardItemObjects(dashboardItems, currentUser) {
    let dashBoardObjects = [];
    let self = this;
    let promises = [];
    let rejectedDashboardItems = 0;
    let rejectedDashboardsType = "";
    let allowedDashboardItems = ["CHART", "EVENT_CHART", "TABLE", "REPORT_TABLE", "EVENT_REPORT"];
    return new Promise(function (resolve, reject) {
      dashboardItems.forEach(dashboardItem=> {
        if (allowedDashboardItems.indexOf(dashboardItem.type) > -1) {
          promises.push(
            self.getDashBoardItemObject(dashboardItem, currentUser).then(dashBoardObject=> {
              dashBoardObjects.push(dashBoardObject);
            }, error=> {
            })
          )
        } else {
          rejectedDashboardItems++;
          if (rejectedDashboardItems == dashboardItems.length) {
            if (rejectedDashboardsType.indexOf(dashboardItem.type.toLowerCase()) == -1) {
              rejectedDashboardsType = rejectedDashboardsType + dashboardItem.type.toLowerCase() + ", ";
            }
            console.log("Here we are : " + rejectedDashboardsType);
            reject({
              rejectedDashboardItems: rejectedDashboardItems,
              errorMessage: "Selected dashboard has dashboard items of type " + rejectedDashboardsType + " which are not supported at the moment"
            });
          }
        }
      });
      Observable.forkJoin(promises).subscribe(() => {
          resolve(dashBoardObjects);
        },
        (error) => {
          reject(error);
        })
    });
  }

  /**
   * get dashBoardItemObject with analytic url
   * @param dashboardItem
   * @param currentUser
   * @returns {Promise<T>}
   */
  getDashBoardItemObject(dashboardItem, currentUser) {
    let self = this;
    let url = "/api/25/" + self.formatEnumString(dashboardItem.type) + "s/" + dashboardItem[self.formatEnumString(dashboardItem.type)].id + ".json?fields=:all,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,attributeDimensions[id,name,attribute[id,name,optionSet[id,name,options[id,name]]]],dataElementDimensions[id,name,dataElement[id,name,optionSet[id,name,options[id,name]]]],categoryDimensions[id,name,category[id,name,categoryOptions[id,name,options[id,name]]]]";
    return new Promise(function (resolve, reject) {
      self.httpClient.get(url, currentUser).subscribe(response=> {
        let dashBoardObject = self.getDashBoardItemObjectWithAnalyticsUrl(response.json());
        dashBoardObject.interpretationLikeCount = dashboardItem.interpretationLikeCount;
        dashBoardObject.interpretationCount = dashboardItem.interpretationCount;
        dashBoardObject.visualizationType = dashboardItem.type;
        resolve(dashBoardObject);
      }, error=> {
        reject(error.json());
      });
    });
  }

  /**
   * get analytic data for each object
   * @param dashboardObjects
   * @param currentUser
   * @returns {Promise<T>}
   */
  getAnalyticDataForDashBoardItems(dashboardObjects, currentUser) {
    let data = {};
    let self = this;
    let promises = [];
    return new Promise(function (resolve, reject) {
      dashboardObjects.forEach((dashboardObject:any)=> {
        promises.push(
          self.getAnalyticDataForDashBoardItem(dashboardObject.analyticsUrl, currentUser).then(analyticData=> {
            data[dashboardObject.id] = analyticData;
          }, error=> {
          })
        )
      });
      Observable.forkJoin(promises).subscribe(() => {
          resolve(data);
        },
        (error) => {
          reject(error);
        })
    });
  }

  /**
   * get analytic data from login instance
   * @param analyticsUrl
   * @param currentUser
   * @returns {Promise<T>}
   */
  getAnalyticDataForDashBoardItem(analyticsUrl, currentUser) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.httpClient.get(analyticsUrl, currentUser).subscribe(response=> {
        resolve(response.json());
      }, error=> {
        reject(error.json());
      });
    });
  }

  /**
   * set analytic url on dashboard object
   * @param dashBoardObject
   * @returns {any}
   */
  getDashBoardItemObjectWithAnalyticsUrl(dashBoardObject) {
    let analyticsUrl = this.getDashBoardItemAnalyticsUrl(dashBoardObject);
    dashBoardObject.analyticsUrl = analyticsUrl;
    return dashBoardObject;
  }

  /**
   * get analytic url
   * @param dashBoardObject
   * @returns {string}
   */
  getDashBoardItemAnalyticsUrl(dashBoardObject, useCustomDimension? = false) {
    let url = "/api/25/analytics";
    let column = "";
    let row = "";
    let filter = "";
    if (dashboardType == 'MAP' && dashBoardObject.layer == 'boundary') {
      url += 'geoFeatures';
    } else {
      url += "analytics";
    }

    let column = "";
    let row = "";
    let filter = "";
    //checking for columns
    column = this.getDashboardObjectDimension('columns', dashBoardObject, useCustomDimension);
    row = this.getDashboardObjectDimension('rows', dashBoardObject, useCustomDimension);
    filter = this.getDashboardObjectDimension('filters', dashBoardObject, useCustomDimension);

    //set url base on type
    if (dashboardType == "EVENT_CHART") {
      url += "/events/aggregate/" + dashBoardObject.program.id + ".json?stage=" + dashBoardObject.programStage.id + "&";
    } else if (dashboardType == "EVENT_REPORT") {
      if (dashBoardObject.dataType == "AGGREGATED_VALUES") {
        url += "/events/aggregate/" + dashBoardObject.program.id + ".json?stage=" + dashBoardObject.programStage.id + "&";
      } else {
        url += "/events/query/" + dashBoardObject.program.id + ".json?stage=" + dashBoardObject.programStage.id + "&pageSize=50&";
      }

    } else if (dashboardType == "EVENT_MAP") {
      url += "/events/aggregate/" + dashBoardObject.program.id + ".json?stage=" + dashBoardObject.programStage.id + "&";
    } else if (dashboardType = 'MAP' && dashBoardObject.layer == 'event') {
      url += "/events/query/" + dashBoardObject.program.id + ".json?stage=" + dashBoardObject.programStage.id + "&";
      //@todo consider start and end date
      url += 'startDate=' + dashBoardObject.startDate + '&' + 'endDate=' + dashBoardObject.endDate + '&';
    } else {
      url += ".json?";
    }

    //@todo find best way to structure geoFeatures
    if (dashBoardObject.layer == 'boundary') {
      url += this.getGeoFeatureParameters(dashBoardObject);
    } else {
      url += column + '&' + row;
      url += filter == "" ? "" : '&' + filter;
    }
    // url += "&user=" + currentUserId;

    url += "&displayProperty=NAME" + dashboardType == "EVENT_CHART" ?
      "&outputType=EVENT&"
      : dashboardType == "EVENT_REPORT" ?
      "&outputType=EVENT&displayProperty=NAME"
      : dashboardType == "EVENT_MAP" ?
      "&outputType=EVENT&displayProperty=NAME"
      : "&displayProperty=NAME";
    if (dashBoardObject.layer == 'event') {
      url += "&coordinatesOnly=true";
    }
    return url;
  }

  /**
   *
   * @param dimension
   * @param dashboardObject
   * @param custom
   * @returns {string}
   */
  getDashboardObjectDimension(dimension, dashboardObject, custom = false):string {
    let items:string = "";
    dashboardObject[dimension].forEach((dimensionValue:any) => {
      items += items != "" ? '&' : "";
      if (dimensionValue.dimension != 'dy') {
        items += dimension == 'filters' ? 'filter=' : 'dimension=';
        items += dimensionValue.dimension;
        items += dimensionValue.hasOwnProperty('legendSet') ? '-' + dimensionValue.legendSet.id : "";
        items += ':';
        items += dimensionValue.hasOwnProperty('filter') ? dimensionValue.filter : "";
        if (custom && dashboardObject.hasOwnProperty('custom_' + dimensionValue.dimension)) {
          items += dashboardObject['custom_' + dimensionValue.dimension] + ';';
        } else {
          dimensionValue.items.forEach((itemValue, itemIndex) => {
            items += itemValue.dimensionItem;
            items += itemIndex == dimensionValue.items.length - 1 ? "" : ";";
          })
        }
      }
    });
    return items
  }

  getDashboardItemMetadataIdentifiers(dashBoardObject) {
    let items = "";
    dashBoardObject.rows.forEach((dashBoardObjectRow:any)=> {
      if (dashBoardObjectRow.dimension === "dx") {
        dashBoardObjectRow.items.forEach((dashBoardObjectRowItem:any)=> {
          items += dashBoardObjectRowItem.id + ";"
        });
      } else {
        //find identifiers in the column if not in row
        dashBoardObject.columns.forEach((dashBoardObjectColumn:any) => {
          if (dashBoardObjectColumn.dimension === "dx") {
            dashBoardObjectColumn.items.forEach((dashBoardObjectColumnItem:any)=> {
              items += dashBoardObjectColumnItem.id + ";"
            });
          } else {
            dashBoardObject.filters.forEach((dashBoardObjectFilters:any) => {
              if (dashBoardObjectFilters.dimension === "dx") {
                dashBoardObjectFilters.items.forEach((dashBoardObjectFilterItem:any)=> {
                  items += dashBoardObjectFilterItem.id + ";"
                });
              }
            });
          }
        });
      }
    });
    return items.slice(0, -1);
  }

}
