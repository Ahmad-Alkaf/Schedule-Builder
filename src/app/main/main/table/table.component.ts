import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Final, SolveLec } from './utility/interface';
import { TableBinder } from './utility/tableBinder'
import { SoundService } from 'src/app/sound.service';
import { GenerateTableService } from './utility/generate-table.service';
import { DataService } from 'src/app/data.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [Final, TableBinder]
})
export class TableComponent implements OnInit {
  // table = table;
  constructor(private sound: SoundService, public gt: GenerateTableService, public dataService: DataService, public tableBinder: TableBinder, private final: Final, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('moveable', sanitizer.bypassSecurityTrustHtml(this.final.SVG_moveable));
  }
  public rows = this.tableBinder.lecsToRows(this.dataService.tableLectures);  
  
  ngOnInit(): void {
    this.dataService.tableLecturesEvent.on('tableLecturesChanged', () => {
      this.rows = this.tableBinder.lecsToRows(this.dataService.tableLectures)
    });
    this.dataService.saveState()
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent = (event: any) => {
    var e = window.event ? window.event : event;
    if (e.keyCode == 90 && e.ctrlKey)
      this.dataService.undo();
    else if (e.keyCode == 89 && e.ctrlKey)
      this.dataService.redo();
  }





  drop = (event: CdkDragDrop<(SolveLec | null)[]>) => {
    // console.log(event);
    let preTds: (SolveLec | null)[] = event.previousContainer.data;
    let tds: (SolveLec | null)[] = event.container.data;
    let tdIndex: number = event.currentIndex;
    let tdPreIndex: number = event.previousIndex;
    var td: SolveLec;

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
    } else this.sound.play(this.sound.error)
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
        if (ava == true)
          return true;
      }
    console.log('predicateRow', ava)
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
    for (let row of this.rows)
      for (let td of row.tds) {
        if (td) {
          let index = this.getIndex(row.tds, td);
          td.startTime = this.final.START_TIME + index / 2;
          td.day = row.day;
        }
      }
  }
}
