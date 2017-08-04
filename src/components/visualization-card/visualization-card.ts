import { Component,Input,OnInit } from '@angular/core';
import {VisualizerService} from "../../providers/visualizer-service";
import {DashboardServiceProvider} from "../../providers/dashboard-service/dashboard-service";

/**
 * Generated class for the VisualizationCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'visualization-card',
  templateUrl: 'visualization-card.html'
})
export class VisualizationCardComponent implements OnInit{

  @Input() dashboardItem;
  @Input() dashboardItemData;
  @Input() analyticData ;

  chartObject : any;
  tableObject : any;
  isVisualizationDataLoaded : boolean = false;
  visualizationType : string;

  metadataIdentifiers : any;

  constructor(private visualizationService : VisualizerService,private DashboardServiceProvider :DashboardServiceProvider) {
  }

  ngOnInit(){
    this.visualizationType = '';
    this.initiateVisualization();
  }

  initiateVisualization(){
    if((this.dashboardItem.visualizationType == 'CHART') || (this.dashboardItem.visualizationType == 'EVENT_CHART')) {
      this.visualizationType = "chart";
      this.drawChart();
    } else if ((this.dashboardItem.visualizationType == 'TABLE') || (this.dashboardItem.visualizationType == 'EVENT_REPORT') || (this.dashboardItem.visualizationType == 'REPORT_TABLE')) {
      this.visualizationType = "table";
      this.drawTable();
    }else{
      this.visualizationType = 'not supported';
    }
  }

  drawChart(chartType?:string) {
    this.isVisualizationDataLoaded = false;
    let itemChartType = (this.dashboardItem.type) ? this.dashboardItem.type.toLowerCase() : 'bar';
    let layout: any = {};
    layout['series'] = this.dashboardItem.series ? this.dashboardItem.series : (this.dashboardItem.columns.length > 0) ?this.dashboardItem.columns[0].dimension :  'pe';
    layout['category'] = this.dashboardItem.category ? this.dashboardItem.category :(this.dashboardItem.rows.length > 0)? this.dashboardItem.rows[0].dimension : 'dx';
    this.chartObject = {};
    let chartConfiguration = {
      'type': chartType ? chartType : itemChartType,
      'title': "",
      'show_labels': true,
      'xAxisType': layout.category,
      'yAxisType': layout.series
    };
    this.chartObject = this.visualizationService.drawChart(this.analyticData, chartConfiguration);
    this.chartObject.chart["zoomType"] ="xy";
    this.chartObject.chart["backgroundColor"] = "#F4F4F4";
    this.chartObject["credits"] =  {enabled: false};
    this.isVisualizationDataLoaded = true;
  }

  drawTable() {
    this.isVisualizationDataLoaded = false;
    let dashboardObject = this.dashboardItem;
    let display_list: boolean = false;
    if(this.dashboardItem.visualizationType == 'EVENT_REPORT'){
      if (dashboardObject.dataType == 'EVENTS') {
        display_list = true;
      }
    }
    let tableConfiguration = {rows: [], columns: [],hide_zeros: true,display_list:display_list};
    //get columns
    if(dashboardObject.hasOwnProperty('columns')) {
      dashboardObject.columns.forEach(colValue => {
        tableConfiguration.columns.push(colValue.dimension);
      });
    } else {
      tableConfiguration.columns = ['co'];
    }
    //get rows
    if(dashboardObject.hasOwnProperty('rows')) {
      dashboardObject.rows.forEach(rowValue => {
        tableConfiguration.rows.push(rowValue.dimension)
      })
    } else {
      tableConfiguration.rows = ['ou', 'dx', 'pe'];
    }
    this.tableObject = this.visualizationService.drawTable(this.analyticData, tableConfiguration);
    this.isVisualizationDataLoaded = true;
  }

  changeVisualization(visualizationType?){
    if(visualizationType == "table"){
      this.drawTable();
    }else if(visualizationType == "charts"){
      this.drawChart();
    }else if(visualizationType == "dictionary"){
      this.metadataIdentifiers = this.DashboardServiceProvider.getDashboardItemMetadataIdentifiers(this.dashboardItem)
    }
    this.visualizationType= visualizationType;
  }
}
