import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragExit, CdkDropList, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SolveLec, START_TIME, START_TIMES, staticLecs, WeekDays, WEEK_DAYS } from './utility/index';
// import solve, {SolveLec, staticLecs} from './index';
import { Row, table } from './utility/tableBinder'
import * as $ from 'jquery';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  table = table;
  constructor() { }
  
  flow: { curIndex: number, data: (Row[])[] } = { curIndex: -1, data: [] }
  
  ngOnInit (): void  {
    this.table.lecs = [{
      startTime: 8, duration: 1.5, day: 'Saturday', id: Math.random().toString(36).substring(2),
      lecture: { name: 'Math', teacher: 'Ahmed', weekDuration: 6, room: '301' }
    }, {
      startTime: 10, duration: 1, day: 'Saturday', id: Math.random().toString(36).substring(2),
      lecture: { name: 'Chemistry', teacher: 'Ali', weekDuration: 6, room: 'Lab 4' }
    }, {
      startTime: 12, duration: 1, day: 'Thursday', id: Math.random().toString(36).substring(2),
      lecture: { name: 'PM', teacher: 'Hamza', weekDuration: 1, room: '401' }
    }, {
      startTime: 11, duration: 1.5, day: 'Wednesday', id: Math.random().toString(36).substring(2),
      lecture: { name: "HCI", teacher: 'Ahmed', weekDuration: 1.5, room: '500' }
    },
    {
      startTime: 9, duration: 2, day: 'Wednesday', id: Math.random().toString(36).substring(2),
      lecture: { name: 'Server-Side', teacher: 'Hassen', weekDuration: 2, room: '403' }
    },
    {
      startTime: 8, duration: 2, day: 'Sunday', id: Math.random().toString(36).substring(2),
      lecture: { name: 'English', teacher: 'Abduallah', weekDuration: 3, room: '301' },
    },
    {
      startTime: 11, duration: 2, day: 'Sunday', id: Math.random().toString(36).substring(2),
      lecture: { name: 'Database', teacher: 'Mohammed', weekDuration: 2, room: 'Lab 3' }
    }, {
      startTime: 8, duration: 2, day: 'Monday', id: Math.random().toString(36).substring(2),
      lecture: { name: 'Organization', teacher: 'Mohsen', weekDuration: 3, room: 'Lab 4' }
    }, {
      startTime: 10, duration: 2, day: 'Monday', id: Math.random().toString(36).substring(2),
      lecture: { name: 'Organization', teacher: 'Mohsen', weekDuration: 3, room: 'Lab 4' }
    }, {
      startTime: 12, duration: 1, day: 'Monday', id: Math.random().toString(36).substring(2),
      lecture: { name: 'JavaScript', teacher: 'Omer', weekDuration: 2, room: '233' }
    }
    ];
    this.pushToTableHistory()
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent = (event: any) => {
    var e = window.event ? window.event : event;
    if (e.keyCode == 90 && e.ctrlKey)
      this.undo();
    else if (e.keyCode == 89 && e.ctrlKey)
      this.redo();
  }

  pushToTableHistory = () => {
    // console.log(this.table)
    // console.log('cloned',JSON.parse(JSON.stringify(this.table.rows)))
    this.flow.data[this.flow.curIndex+1] = JSON.parse(JSON.stringify(this.table.rows));
    this.flow.curIndex = ++this.flow.curIndex;
    this.flow.data.splice(this.flow.curIndex, this.flow.data.length -1- this.flow.curIndex);
    console.log('pushed index',this.flow.curIndex)
    // this.table.rows = this.flow.data[this.flow.curIndex];
  }

  undo = () => {
    // console.log('before', this.flow.data[this.flow.curIndex]);
    // console.log('after', this.flow.data[this.flow.curIndex - 1]);
    if (this.flow.data[this.flow.curIndex - 1]) {
      // this.flow.data.splice(this.flow.data.length-1, 1);
      this.table.rows = JSON.parse(JSON.stringify(this.flow.data[--this.flow.curIndex]));
      console.log('retain index',this.flow.curIndex)
    }
    else console.log('can not undo. you are up to date');
  }
  
  redo = () => {
    if (this.flow.data[this.flow.curIndex + 1]) 
      this.table.rows = JSON.parse(JSON.stringify(this.flow.data[++this.flow.curIndex]));
    else console.log('can not redo. you are up to data')
    
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
    }
    this.pushToTableHistory()
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
          // console.log('invalid i', [...tds], i, tds[i])
          if (tds[i] != null && tds[i] != lec) {
            //if there is space for lec but in the wrong position then just shift because we wrote statically. there is limit of 4 lectures which is enough for row that limit by 4 lecs

            if (tds[i + 1] === null) {
              tds[i + 1] = tds[i];
              tds[i] = null
            } else if (tds[i + 2] === null) {
              tds[i + 2] = tds[i + 1];
              tds[i + 1] = tds[i];
              tds[i] = null;
            } else if (tds[i + 3] === null) {
              tds[i + 3] = tds[i + 2];
              tds[i + 2] = tds[i + 1];
              tds[i + 1] = tds[i];
              tds[i] = null;
            } else if (tds[i + 4] === null) {
              tds[i + 4] = tds[i + 3];
              tds[i + 3] = tds[i + 2];
              tds[i + 2] = tds[i + 1];
              tds[i + 1] = tds[i];
              tds[i] = null;
            } else return false;
          } else return false;
        } else {
          // console.log('valid i', [...tds], 'i', i, 'tds[i]', tds[i], 'dur*2', lec.duration * 2, 'lec', lec)
        }

    } else {//same row

    }

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

  predicateItems = (index: number, cdk: CdkDrag<SolveLec>, drop: CdkDropList): boolean => {
    let tds: (SolveLec | null)[] = cdk.dropContainer.data;
    let lec: SolveLec = cdk.data;
    // let plTds: (SolveLec | null)[] = this.getPlaceholderRow().tds;
    return true;
  }

  predicateRow = (drag: CdkDrag, drop: CdkDropList) => {
    //this fun called rows.length -1 times because it checks all row without the row that already contains td
    let lec = drag.data;
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
    return ava;
  }

  getPlaceholderRow = (): { day: WeekDays, tds: (SolveLec | null)[] } => {
    let placeholderDay: string = $('tr .cdk-drag-placeholder').parent().find('td:first').text();
    for (let row of this.table.rows) {
      if (row.day == placeholderDay)
        return row;
    }
    console.error('lecture was not in any row!!!')
    return { day: 'Saturday', tds: [null] }
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
          td.startTime = START_TIME + index / 2;
          td.day = row.day;
        }
      }
  }
}
