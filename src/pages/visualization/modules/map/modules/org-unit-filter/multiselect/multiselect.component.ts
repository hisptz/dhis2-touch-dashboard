import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multiselect',
  templateUrl: 'multiselect.component.html',
  styleUrls: ['multiselect.component.css']
})
export class MultiselectComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() placeholder: string;
  @Input() starting_items: any[] = [];
  @Input() selected_items: any[] = [];
  @Input() prefix: string;
  @Input() prefix_multiple: string;
  @Input() selectionMode: string;
  hideOptions: boolean;
  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
    this.placeholder = 'Select';
    this.prefix = '';
    this.prefix_multiple = '';
    this.hideOptions = true;
  }

  ngOnInit() {
    if (this.starting_items.length != 0) {
      if (this.selected_items.length == 0) {
        this.selected_items = this.starting_items;
      } else {
        this.starting_items.forEach(val => {
          this.selected_items.push(val);
        });
      }
      this.onSelected.emit(this.selected_items);
    }
  }

  displayPerTree() {
    this.hideOptions = !this.hideOptions;
  }

  reset() {
    this.selected_items = [];
    this.onSelected.emit(this.selected_items);
  }

  checkItemAvailabilty(item, array): boolean {
    let checker = false;
    for (let per of array) {
      if (per.id == item.id) {
        checker = true;
      }
    }
    return checker;
  }

  selectItem(item, e) {
    e.stopPropagation();
    if (this.checkItemAvailabilty(item, this.selected_items)) {
      this.selected_items.splice(this.selected_items.indexOf(item), 1);
    } else {
      this.selected_items.push(item);
    }
    this.onSelected.emit(this.selected_items);
  }

  deActivateNode(item, event) {
    this.selected_items.splice(this.selected_items.indexOf(item), 1);
    this.onSelected.emit(this.selected_items);
    event.stopPropagation();
  }
}
