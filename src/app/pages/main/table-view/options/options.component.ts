import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTableComponent } from '@dialog/edit-table/edit-table.component';
import { DataService } from '@service/data.service';
import { Table } from '@service/tableBinder';
declare var jsPDF: any;

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent  {
  @Input() table: Table = new Table(-1, 'NULL');
  constructor(private dataService:DataService,private dialog:MatDialog) { }

  
  delete() {
    this.dataService.tables.splice(this.dataService.tables.indexOf(this.table), 1);
    this.dataService.saveState();
    this.dataService.tabActiveIndex = this.dataService.tables.length - 1;
  }
  
  changeName() {
    const ref = this.dialog.open(EditTableComponent, {
      width: '300px',
    });
    ref.afterClosed().subscribe((result: string) => {
      console.log({ result });
      if (result){
        this.table.name = result;
        this.dataService.saveState();
      }
    })
  }
  
  pdf = () => {
    let id = 'table' + this.table.index;
    
    //FIRST TRY
    let pdf = new jsPDF('l', 'pt', [1920, 640]);
    $('table mat-icon').addClass('d-none');
      pdf.html(document.getElementById(id), {
        callback:  (pdf: any) =>{
          
              pdf.save(`Table: ${this.table.name} - ${new Date().toISOString().substring(0,10)}.pdf`);
          $('table mat-icon').removeClass('d-none');
        }
      });
    //SECOND TRY
  //     var divToPrint=document.getElementById(id);
  // let  newWin= window.open("");
  //  newWin?.document.write(divToPrint?.outerHTML||'null');
  //  newWin?.print();
  //  newWin?.close();
    
    //THIRD TRY
    // //Get the HTML of div
    // var divElements = document.getElementById(id)?.innerHTML;
    // //Get the HTML of whole page
    // var oldPage = document.body.innerHTML;
    // //Reset the page's HTML with div's HTML only
    // document.body.innerHTML = 
    //   "<html><head><title></title></head><body>" + 
    //   divElements + "</body>";
    // //Print Page
    // window.print();
    // //Restore orignal HTML
    // document.body.innerHTML = oldPage;
    
    
    
  }
}
