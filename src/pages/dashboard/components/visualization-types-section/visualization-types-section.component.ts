import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-visualization-types-section',
  templateUrl: './visualization-types-section.component.html',
})
export class VisualizationTypesSectionComponent implements OnInit {

  @Input() currentVisualization: string;
  @Output() onCurrentVisualizationChange: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  onVisualizationSelect(e, type) {
    e.stopPropagation();
    this.onCurrentVisualizationChange.emit(type);
  }

}
