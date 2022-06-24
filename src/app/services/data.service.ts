import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditLectureComponent } from '../dialog/edit-lecture/edit-lecture.component';
// import {EventEmitter}  from 'events';
import { Final, Subject, MyEventEmitter, Room, Row, SolveLec, Teacher, WeekDays } from '../main/main/table/utility/static';
import { Table } from '../main/main/table/utility/tableBinder';
import { ApiService } from './api.service';
import { SoundService } from './sound.service';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  //!undo and redo are not consistent because dataService is not updated when they change table values
  public teachers: Teacher[] = [{ name: 'Ahmed Shaikh' },
  { name: 'Hassen' },
  { name: 'Hamzah' }];

  subjects: Subject[] = [{ name: 'PM' },
  { name: 'HCI' },
  { name: 'Server-side' }];

  rooms: Room[] = [{ name: '301' },
  { name: '401' },
  { name: '302' }];

  public tables: Table[] = [];

  public newLecContainer: SolveLec[] = [{
    startTime: -1, duration: 3, day: 'Friday', id: Math.random().toString(36).substring(2),
    lecture: { name: 'C++', teacher: 'Omer', weekDuration: -1, room: '233' }
  }, {
    startTime: -1, duration: 1, day: 'Friday', id: Math.random().toString(36).substring(2),
    lecture: { name: 'Java', teacher: 'Salem Hassen', weekDuration: -1, room: '233' }
  }];

  private flow: { curIndex: number, data: ({ teachers: Teacher[], lessons: Subject[], rooms: Room[], tables: Table[], newLecContainer: SolveLec[] })[] } = { curIndex: -1, data: [] }

  private clipboard: SolveLec | undefined = undefined
  public focused: SolveLec | { index: number, day: WeekDays } | undefined = undefined;

  constructor(private sound: SoundService, private final: Final,
    private dialog: MatDialog, private api:ApiService) {
    this.tables.push(new Table(0, 'IT'));
    this.tables[0].lectures = [{
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
      }];
      this.tables.push(new Table(1, 'CIS'));
      this.tables[1].lectures = [{
        startTime: 8, duration: 1.5, day: 'Saturday', id: Math.random().toString(36).substring(2),
        lecture: { name: 'Math', teacher: 'Ahmed', weekDuration: 6, room: '301' }
      }, {
        startTime: 10, duration: 1, day: 'Saturday', id: Math.random().toString(36).substring(2),
        lecture: { name: 'Chemistry', teacher: 'Ali', weekDuration: 6, room: 'Lab 4' }
      }, {
        startTime: 8, duration: 2, day: 'Monday', id: Math.random().toString(36).substring(2),
        lecture: { name: 'Organization', teacher: 'Mohsen', weekDuration: 3, room: 'Lab 4' }
      }, {
        startTime: 10, duration: 2, day: 'Monday', id: Math.random().toString(36).substring(2),
        lecture: { name: 'Organization', teacher: 'Mohsen', weekDuration: 3, room: 'Lab 4' }
      }, {
        startTime: 12, duration: 1, day: 'Monday', id: Math.random().toString(36).substring(2),
        lecture: { name: 'JavaScript', teacher: 'Omer', weekDuration: 2, room: '233' }
      }];
  }
  //VVVV dataService Functions VVVV
  /**
   * will save dataService variables into (flow) array to be return when undo or redo
   */
  public saveState = () => {//todo if after undo we saveState then 
    
    this.flow.data[this.flow.curIndex + 1] = JSON.parse(JSON.stringify({
      teachers: this.teachers,
      lessons: this.subjects,
      rooms: this.rooms,
      tables: this.tables.map(v=>v.lectures),
      newLecContainer: this.newLecContainer
    }));
    this.flow.curIndex = ++this.flow.curIndex;
    this.flow.data.splice(this.flow.curIndex, this.flow.data.length - 1 - this.flow.curIndex);
    console.log('pushed index', this.flow.curIndex)
  }

  public undo = () => {
    if (this.flow.data[this.flow.curIndex - 1]) {
      const { teachers, lessons, rooms, tables, newLecContainer } = JSON.parse(JSON.stringify(this.flow.data[--this.flow.curIndex]));
      this.teachers = teachers;
      this.subjects = lessons;
      this.rooms = rooms;
      for (let i = 0; i < tables.length; i++)
      if (this.tables[i])
        this.tables[i].lectures = tables[i];
      else throw new Error(`wow you made it that far ok then come here handle me`);
      this.newLecContainer = newLecContainer;
      console.log('retain index', this.flow.curIndex);
    }
    else this.sound.play('notification');
  }

  public redo = () => {
    if (this.flow.data[this.flow.curIndex + 1]) {
      const { teachers, lessons, rooms, tables, newLecContainer } = JSON.parse(JSON.stringify(this.flow.data[++this.flow.curIndex]));
      this.teachers = teachers;
      this.subjects = lessons;
      this.rooms = rooms;
      for (let i = 0; i < tables.length; i++)
        if (this.tables[i])
          this.tables[i].lectures = tables[i];
        else throw new Error(`wow you made it that far ok then come here handle me`);
      this.newLecContainer = newLecContainer;
      console.log('retain index', this.flow.curIndex);
    } else this.sound.play('notification');
  }

  /**
     * edit the focused lecture if null play 'notification' sound
     */
  public editFocus(): void {//todo keyboard shortcut
    if (!this.focused || 'index' in this.focused)
      this.sound.play('notification')
    else this.edit(this.focused)
  }

  /**
   * 
   * @param lecture lecture to be edit
   * pop up dialog with copy of edited lecture and if submit then result form will be assigned at edited lecture
   */
  public edit(lecture: SolveLec): void {
    const ref = this.dialog.open(EditLectureComponent, {
      width: '800px',
      data: JSON.parse(JSON.stringify(lecture))//copy
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;//cancel dialog
      let table = this.getTableOf(lecture);
      if (table == 'container')
        this.newLecContainer.splice(this.newLecContainer.indexOf(lecture), 1, result);
      else {
        let lecs = [...table.lectures];
        lecs.splice(table.lectures.indexOf(lecture), 1, result);
        table.lectures = lecs;
      }
      this.saveState()
    });
  }
  /**
     * delete the focused lecture if null play 'notification' sound
     */
  public deleteFocus() {
    if (!this.focused || 'index' in this.focused)
      this.sound.play('notification')
    else this.delete(this.focused)
  }
  public delete(lecture: SolveLec): void {
    console.log('delete called');
    let table = this.getTableOf(lecture);
    if (table == 'container') {
      this.newLecContainer.splice(this.newLecContainer.indexOf(lecture), 1);
    } else {
      let lecs = [...table.lectures];
      lecs.splice(table.lectures.indexOf(lecture), 1);
      table.lectures = lecs;
    }
    //todo snackbar: lecture deleted Undo
    this.saveState();
  }

  /**
   * copy the focused lecture if null play 'notification' sound
   */
  public copyFocus() {
    if (!this.focused || 'index' in this.focused)
      this.sound.play('notification');
    else
      this.copy(this.focused)
  }

  public copy(lecture: SolveLec) {
    console.log('copy', lecture)
    this.clipboard = JSON.parse(JSON.stringify(lecture));//todo snackbar: lecture copied
  }

  /**
  * cut the focused lecture if null play 'notification' sound
  */
  public cutFocus() {
    if (!this.focused || 'index' in this.focused) //typeof {{ index: number, day: WeekDays }
      this.sound.play('notification');
    else
      this.cut(this.focused);//todo snackbar: lecture cut
  }

  /**
   * 
   * @param lecture lecture to be cut
   */
  public cut(lecture: SolveLec) {
    console.log('cut', lecture)
    this.clipboard = JSON.parse(JSON.stringify(lecture));
    this.delete(lecture);
  }

  /**
  * paste on the focused td if td=lecture play 'notification' sound
  */
  public pasteFocus() {
    if (this.focused && 'index' in this.focused)
      this.paste(this.focused);
    else this.sound.play('notification');
  }

  /**
   * @param pos is object that have index of tds and day to know where to paste
   */
  public paste(pos: { index: number, day: WeekDays }): void {
    if (!this.clipboard)//empty clipboard
      return this.sound.play('notification');
    
    let lecture: SolveLec = JSON.parse(JSON.stringify(this.clipboard));//

    if (lecture && this.isAvailableSpace(pos.day, pos.index, lecture.duration)) {
      lecture.day = pos.day;
      lecture.startTime = this.getStartTime(pos.day, pos.index);
      if (lecture.startTime == -1)
        console.error('paste index is in critical position. come here');
      let table = this.getActiveTable();
      table.lectures = [...table.lectures, lecture];
      this.saveState();
    } else this.sound.play('notification');
    //todo snackbar: empty clipboard
  }

  /**
   * 
   * @param lecture 
   * @returns Table object that contains @param lecture
   */
  public getTableOf(lecture: SolveLec): Table | 'container' {
    for (let table of this.tables)
      if (table.lectures.includes(lecture))
        return table;
    if (this.newLecContainer.includes(lecture))
      return 'container';
    throw new Error(`lecture is a copy that doesn't contained in any table either the container!`)
  }

  /**
   * the index table of the opened tab that user on
   */
  public tabActiveIndex: number = 0;
  /**
   * @returns the table of the opened tab that user on
   */
  public getActiveTable(): Table {
    return this.tables[this.tabActiveIndex];
  }


  /**
   * NOTE: if there is no lecture then at pram startTime this function will return -1.
   * @param startTime of lecture in row.tds where row.day = @param day
   * @returns index of that lecture in row.tds. -1 if not found
   */
  public getIndex(day: WeekDays, startTime: number): number {
    const row: Row = this.getActiveTable().rows.filter(v => v.day == day)[0];
    for (let i = 0; i < row.tds.length; i++) {
      let td = row.tds[i];
      if (td)
        if (td.startTime == startTime)
          return i;
        else if (td.startTime > startTime)
          break;
    }
    return -1;
  }

  /********************************* PRIVATE METHODS *****************************************************/

  /**
   * 
   * @pram index for position in row
   * @returns boolean whether a lecture can be place in that day, index with its duration
   */
  private isAvailableSpace(day: WeekDays, index: number, duration: number): boolean {
    const row: Row = this.getActiveTable().rows.filter(v => v.day == day)[0];
    for (let i = index; i < index + duration * 2; i++) {
      if (row.tds.length <= i || row.tds[i] != null)
        return false;
    }
    return true;
  }

  /**
   * 
   * @param index of lecture in row.tds where row.day = @param day
   * @returns startTime of that index. -1 if not found
   */
  private getStartTime(day: WeekDays, index: number): number {
    const row: Row = this.getActiveTable().rows.filter(v => v.day == day)[0];
    let st = this.final.START_TIME;
    for (let i = 0; i < row.tds.length; i++) {
      if (index == i)
        return st;
      let td = row.tds[i];
      if (td && 'duration' in td)
        st += td.duration;
      else
        st += this.final.STEP_TIME
    }
    return -1;
  }

}
