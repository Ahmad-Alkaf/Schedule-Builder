import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDropList, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SolveLec, START_TIME, START_TIMES, WeekDays, WEEK_DAYS } from './utility/index';
// import solve, {SolveLec, staticLecs} from './index';
import { Row, table } from './utility/tableBinder'
import * as $ from 'jquery';
import { SoundService } from 'src/app/sound.service';
import { GenerateTableService } from './utility/generate-table.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  table = table;
  constructor(private sound: SoundService, public gt:GenerateTableService) { }

  flow: { curIndex: number, data: (Row[])[] } = { curIndex: -1, data: [] }

  ngOnInit(): void {
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
    this.flow.data[this.flow.curIndex + 1] = JSON.parse(JSON.stringify(this.table.rows));
    this.flow.curIndex = ++this.flow.curIndex;
    this.flow.data.splice(this.flow.curIndex, this.flow.data.length - 1 - this.flow.curIndex);
    console.log('pushed index', this.flow.curIndex)
  }

  undo = () => {
    if (this.flow.data[this.flow.curIndex - 1]) {
      this.table.rows = JSON.parse(JSON.stringify(this.flow.data[--this.flow.curIndex]));
      console.log('retain index', this.flow.curIndex)
    }
    else this.sound.play(this.sound.notification);
  }

  redo = () => {
    if (this.flow.data[this.flow.curIndex + 1])
      this.table.rows = JSON.parse(JSON.stringify(this.flow.data[++this.flow.curIndex]));
    else this.sound.play(this.sound.notification)
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
      this.pushToTableHistory()
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
