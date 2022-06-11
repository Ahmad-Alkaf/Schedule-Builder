import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragExit, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { SolveLec, START_TIME, START_TIMES, staticLecs, WeekDays, WEEK_DAYS } from './utility/index';
// import solve, {SolveLec, staticLecs} from './index';
import { table } from './utility/tableBinder'
import * as $ from 'jquery';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  table = table;
  tableAttHeader: string[] = ['day', '8', '9', '10', '11', '12'];
  constructor() { }

  ngOnInit(): void {
    table.lecs = [{
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
  }

  drop = (event: CdkDragDrop<(SolveLec | null)[]>) => {//todo change type of event <string[]> to the object
    // console.log(event);
    let preTds: (SolveLec | null)[] = event.previousContainer.data;
    let tds: (SolveLec | null)[] = event.container.data;
    let tdIndex: number = event.currentIndex;
    let tdPreIndex: number = event.previousIndex;
    var td: SolveLec;

    if (this.isValidMovement(tds, preTds, tdIndex, tdPreIndex)) {
      td = this.moveTd(tds, preTds, tdIndex, tdPreIndex);
      if (preTds !== tds) {//we need to fix the <td> of each row because there are transfer lec between row
        preTds.splice(tdPreIndex, 0, ...Array(td.duration * 2).fill(null));
        tds.splice(tdIndex + 1, td.duration * 2);
      }
      this.updateTime();
    }
  }
  isValidMovement(tds: (SolveLec|null)[],preTds:(SolveLec|null)[],tdIndex:number,tdPreIndex:number):boolean {
    if (!tds.includes(null))
      return false;
    return true;
  }
  moveTd = (tds: (SolveLec | null)[], preTds: (SolveLec | null)[], tdIndex: number, tdPreIndex: number): SolveLec => {
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
    return tds[tdIndex] || { id: '-1', day: WEEK_DAYS[0], duration: 0, startTime: 0, lecture: { name: 'oiadfdv&*^', weekDuration: 0, teacher: '', room: '' } };
  }

  draggingIndex: number = -1;
  predicateItems = (index: number, cdk: CdkDrag<SolveLec>): boolean => {
    this.draggingIndex = index;
    let tds: (SolveLec | null)[] = cdk.dropContainer.data;
    let lec: SolveLec = cdk.data;
    let plTds: (SolveLec | null)[] = this.getPlaceholderRow().tds;

    let demo: (SolveLec | null)[] = [];
    for (let v of plTds) {
      if (v == null)
        demo.push(v);
      else for (let i = 0; i < v.duration * 2; i++)
        demo.push(v);
    };

    return true;
  }

  predicateRow = (cdkDrag: CdkDrag<SolveLec>): boolean => {
    let tds: (SolveLec | null)[] = cdkDrag.dropContainer.data;
    let lec: SolveLec = cdkDrag.data;
    let plRow = this.getPlaceholderRow();
    let plTds = plRow.tds;

    return true;
  }
  avaSpaceInRow(tds: (SolveLec | null)[], lec: SolveLec): boolean {
    for (let i = 0; i < tds.length; i++) {
      let ava = true;
      if (tds[i] == null)
        for (let j = i; j < lec.duration * 2; j++)
          if (tds.length <= j || tds[j] != null) { ava = false; break; }

      if (ava == true)
        return true;
    }

    return false;
  }
  enteredRow = (e: CdkDragEnter<any>) => {
    let tds: (SolveLec | null)[] = e.container.data;
    let lec: SolveLec = e.item.data;
    let index = e.currentIndex;
  }

  exitRow(e: CdkDragExit<any>) {
    let tds: (SolveLec | null)[] = e.item.dropContainer.data;
    let lec: SolveLec = e.item.data;

  }


  getPlaceholderRow(): { day: WeekDays, tds: (SolveLec | null)[] } {
    let placeholderDay: string = $('tr .cdk-drag-placeholder').parent().find('td:first').text();
    for (let row of table.rows) {
      if (row.day == placeholderDay)
        return row;
    }
    console.error('lecture was not in any row!!!')
    return { day: 'Saturday', tds: [null] }
  }

  // getPlaceholderIndex(): any{
  //   // let placeholderDay: string = $('tr td.cdk-drag-placeholder')
  //   let placeholder = $('tr td.cdk-drag-placeholder');
  //   let tr = placeholder.parent().children();
  //   for (let i = 1; i < tr.length; i++)
  //     if(tr[i] == placeholder[0])
  //       console.log(i-1)
  //   for (let row of table.rows) {
  //     if (row.day == $('tr div.cdk-drag-placeholder').parent().find('td:first').text())
  //       return row.tds;
  //   }
  // }
  /**
   * Notice: lec should includes in tds. i.e don't use me inside predicate functions
   * @param tds 
   * @param lec 
   * @returns index that count lecture by double its duration
   */
  getIndex(tds: (SolveLec | null)[], lec: SolveLec): number {
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
    for (let row of table.rows)
      for (let td of row.tds) {
        if (td) {
          let index = this.getIndex(row.tds, td);
          td.startTime = START_TIME + index / 2;
          td.day = row.day;
        }
      }
  }
  // updateRows = (): void => {
  //   for (let row of table.rows) {
  //     let totalIndexes: number = 0;
  //     for (let i = 0; i < row.tds.length; i++) {
  //       let td = row.tds[i];
  //       totalIndexes += td != null ? td.duration * 2 : 1;
  //       if (8 + totalIndexes / 2 < (td.startTime)) {
  //         row.tds.splice(row.tds.indexOf(td), 0, null);
  //         console.log(row);
  //         return this.updateRows();
  //       } else if (8 + totalIndexes / 2 < td.startTime) {
  //         row.tds.splice(row.tds.indexOf(td), 1);
  //         return this.updateRows();
  //       }
  //     }

  //   }
  // }
}
