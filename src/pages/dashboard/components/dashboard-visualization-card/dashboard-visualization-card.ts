import { Component, Input, OnInit } from "@angular/core";
import { Visualization } from "../../../../models/visualization";

/**
 * Generated class for the DashboardVisualizationCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "dashboard-visualization-card",
  templateUrl: "dashboard-visualization-card.html"
})
export class DashboardVisualizationCardComponent implements OnInit {
  @Input() visualizationObject: Visualization;

  constructor() {}

  ngOnInit() {}
}
