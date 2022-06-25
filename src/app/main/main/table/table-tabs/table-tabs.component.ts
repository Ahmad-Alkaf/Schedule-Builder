import { Component, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AddTableComponent } from 'src/app/dialog/add-table/add-table.component';
import { DataService } from 'src/app/services/data.service';
import { TableComponent } from '../table.component';
import { Table } from '../utility/tableBinder';

@Component({
  selector: 'app-table-tabs',
  templateUrl: './table-tabs.component.html',
  styleUrls: ['./table-tabs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TableTabsComponent {

  constructor(public dataService: DataService, private dialog: MatDialog) { }
 
  
  
  
  
  
  
  openAddTable() {
    const ref = this.dialog.open(AddTableComponent, {
      width: '300px',
    });
    ref.afterClosed().subscribe((result: string) => {
      console.log({ result });
      if (result){
        this.dataService.tables.push(new Table(this.dataService.tables.length, result));
        this.dataService.saveState();
        console.log('saveState by openAddTable in table-tabs')
        this.dataService.tabActiveIndex = this.dataService.tables.length - 1;
      }
    })
  }
}
