import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditTableComponent } from '@dialog/edit-table/edit-table.component';
import { GenLecturesComponent } from '@dialog/gen-lectures/gen-lectures.component';
import { Prompt, PromptComponent } from '@dialog/prompt/prompt.component';
import { DataService } from '@service/data.service';
import { Table } from '@service/tableBinder';
declare var jsPDF: any;

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  @Input() table: Table = new Table(-1, 'NULL');
  constructor(private dataService: DataService, private dialog: MatDialog) { }
  ngOnInit(): void {
    // this.addLecturesInValidPos();
  }


  delete() {
    const prompt: Prompt = {
      title: { text: 'Delete Table?', color: 'var(--warn-color)' },
      content: 'Are you sure you want to delete \'' + this.table.name + '\' table Permanently with its contained lectures!',
      actions: {
        yes: { text: 'Delete', color: 'warn' },
        no: { text: 'Cancel', color: 'primary' }
      }
    }
    const ref = this.dialog.open(PromptComponent, {
      width: '400px',
      data: prompt
    })
    ref.afterClosed().subscribe((res) => {
      if (res === prompt.actions?.yes.text) {
        this.dataService.tables.splice(this.dataService.tables.indexOf(this.table), 1);
        this.dataService.saveState();
        this.dataService.tabActiveIndex = this.dataService.tables.length - 1;
      }

    })
  }

  changeName() {
    const ref = this.dialog.open(EditTableComponent, {
      width: '300px',
      data: this.table.name
    });
    ref.afterClosed().subscribe((result: string) => {
      console.log({ result });
      if (result) {
        this.table.name = result;
        this.dataService.saveState();
      }
    })
  }
  
  addLecturesInValidPos() {
    let ref =  this.dialog.open(GenLecturesComponent, {
      data: this.table
    });
    
  }

  pdf = () => {
    let id = 'table' + this.table.index;

    //FIRST TRY
    let pdf = new jsPDF('l', 'pt', [1920, 640]);
    $('table mat-icon').addClass('d-none');

    // console.log($('td')[0].classList); //('light-theme-indigo');
    // $('table#' + id + ' .td').addClass('tdForPrint')
    $('table#' + id).addClass('light-theme-indigo');
    pdf.html(document.getElementById(id), {
      callback: (pdf: any) => {

        pdf.save(`Table: ${this.table.name} - ${new Date().toISOString().substring(0, 10)}.pdf`);
        $('table mat-icon').removeClass('d-none');
        $('table#' + id).removeClass('light-theme-indigo');
    // $('table#' + id + ' .td').removeClass('tdForPrint')
    // $('table#' + id + ' .td').css('border', '1px solid var(--disabled-color)');
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
