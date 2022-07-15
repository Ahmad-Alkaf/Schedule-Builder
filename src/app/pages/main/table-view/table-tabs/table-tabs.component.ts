import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AddTableComponent } from '@dialog/add-table/add-table.component';
import { DataService } from '@service/data.service';
import { Table } from '@service/tableBinder';

@Component({
  selector: 'app-table-tabs',
  templateUrl: './table-tabs.component.html',
  styleUrls: ['./table-tabs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TableTabsComponent {

  constructor(public dataService: DataService, private dialog: MatDialog) { }
 
  
  
  tabChanged(event:MatTabChangeEvent) {
    if (event.index >= this.dataService.tables.length) { }
    else if (this.tmp == true) setTimeout(() => this.dataService.tabActiveIndex = event.index);
    else this.tmp = true;
      // setTimeout(()=>this.dataService.tabActiveIndex = event.index);
  }
  tmp = false;
  
  
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
        this.dataService.tabActiveIndex = 100;
        setTimeout(() => this.dataService.tabActiveIndex = this.dataService.tables.length - 1);
      }
    })
  }
}
