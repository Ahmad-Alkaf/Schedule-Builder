import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Final, SolveLec, WeekDays } from '@service/static';
import { Table } from '@service/tableBinder'
import { SoundService } from '@service/sound.service';
import { GenerateTableService } from '@service/generate-table.service';
import { DataService } from '@service/data.service';
import { ControlLectureService } from '@service/control-lecture.service';
declare var jsPDF: any;

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() table: Table = new Table(-1,'error: assigned manually');
  constructor(private lecControl:ControlLectureService,private sound: SoundService, public gt: GenerateTableService, public dataService: DataService, private final: Final) {
  }

  ngOnInit(): void {
    
    // this.dataService.saveState()
  }

  focused(td: SolveLec | { index: number; day: WeekDays; }): void{
      this.lecControl.focused = td;
  }





  drop = (event: CdkDragDrop<(SolveLec | null)[]>) => {
    // console.log('drop in table');
    let preTds: (SolveLec | null)[] = event.previousContainer.data;
    let tds: (SolveLec | null)[] = event.container.data;
    let tdIndex: number = event.currentIndex;
    let tdPreIndex: number = event.previousIndex;
    var td: SolveLec;

    // console.log('tds', ...tds)
    // console.log('preTds', ...preTds)

    if (this.dataService.newLecContainer == preTds) {//from container to table
      let td = preTds[tdPreIndex];
      if (td) {
        if (this.validContainerToTable(preTds, tds, tdIndex, tdPreIndex, td)) {
          tds.splice(tdIndex, td.duration * 2, td);
          this.updateTime();
          this.dataService.newLecContainer.splice(this.dataService.newLecContainer.indexOf(td), 1);
          this.table.lectures = [...this.table.lectures,td];
          this.dataService.saveState();
        } else {
          console.log('invalid container to table'); //todo error sound
          this.sound.play('error');
        }

      } else throw new Error('unexpected value of td=' + td)
      
    } else
      if (this.isValidMovement(tds, preTds, tdIndex, tdPreIndex)) {
        let moving = this.moveTd(tds, preTds, tdIndex, tdPreIndex);
        if (moving === undefined)
          return console.error('moveTd return undefined!')
        else td = moving;

        if (preTds !== tds) {//we need to fix the <td> of each row because there are transfer lec between row
          preTds.splice(tdPreIndex, 0, ...Array(td.duration * 2).fill(null));
          tds.splice(tdIndex + 1, td.duration * 2);
        }
        this.updateTime();
        this.dataService.saveState()
      } else this.sound.play('error')
  }
  
  validContainerToTable=(preTds: (SolveLec | null)[], tds: (SolveLec | null)[], tdIndex: number, tdPreIndex: number, td: SolveLec):boolean =>{
    for (let i = tdIndex; i < tdIndex + td.duration * 2; i++)
      if (tds.length <= i || (tds[i] != null && tds[i] != td))
        return false;
    return true;
  }

  isValidMovement = (tds: (SolveLec | null)[], preTds: (SolveLec | null)[], tdIndex: number, tdPreIndex: number): boolean => {
    const tmp = preTds[tdPreIndex];
    let lec: SolveLec;
    if (tmp === undefined || tmp === null) {
      console.error('item dragged is undefined', preTds, tdPreIndex, tmp);
      return false;
    }
    else lec = tmp;

    if (preTds != tds) {//another row
      if (!tds.includes(null)) {
        return false;
      }
      for (let i = tdIndex; i < tdIndex + lec.duration * 2; i++)
        if (tds.length <= i || (tds[i] != null && tds[i] != lec)) {
          return false;
        }

    } else { }//same row



    return true;
  }


  moveTd = (tds: (SolveLec | null)[], preTds: (SolveLec | null)[], tdIndex: number, tdPreIndex: number): SolveLec | undefined => {
    if (preTds === tds)
      moveItemInArray(tds, tdPreIndex, tdIndex);
    else
      transferArrayItem(
        preTds,
        tds,
        tdPreIndex,
        tdIndex,
      );
    this.updateTime();
    return tds[tdIndex] || undefined;
  }

  predicateRow = (drag: CdkDrag, drop: CdkDropList) => {
    //this fun called rows.length -1 times because it checks all row without the row that already contains td
    let lec = drag.data;
    // console.log(lec);
    let tds = drop.data;
    // console.log('drop',drop)
    let ava = false;
    for (let i = 0; i < tds.length; i++)
      if (tds[i] === null) {
        ava = true;
        for (let j = i; j < i + lec.duration * 2; j++)
          if (tds.length <= j || tds[j] != null)
            ava = false;
        if (ava == true) {
          // console.log('predicateRow', ava)
          return true;
        }
      }
    // console.log('predicateRow', ava)

    return ava;
  }



  /**
   * Notice: lec should includes in tds. i.e don't use me inside predicate functions
   * @param tds 
   * @param lec 
   * @returns index that count lecture by double its duration
   */
  getIndex = (tds: (SolveLec | null)[], lec: SolveLec): number => {
    let i = 0;
    for (let td of tds) {
      if (td == lec)
        return i;
      if (td)
        i += td.duration * 2;
      else i++;
    }
    console.error(false, `row don't has td! row should fill up with null tds or lectures`)
    return -1;
  }

  updateTime = () => {
    for (let row of this.table.rows)
      for (let td of row.tds) {
        if (td) {
          let index = this.getIndex(row.tds, td);
          td.startTime = this.final.START_TIME + index / 2;
          td.day = row.day;
        }
      }
  }
  
  
  pdf = (id: string) => {
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


