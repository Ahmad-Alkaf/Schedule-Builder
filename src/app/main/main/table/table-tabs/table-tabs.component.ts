import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-table-tabs',
  templateUrl: './table-tabs.component.html',
  styleUrls: ['./table-tabs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TableTabsComponent {

  constructor(public dataService:DataService) { }
  tabChanged(event: MatTabChangeEvent) {
    this.dataService.tabActiveIndex = event.index;
  }

}
