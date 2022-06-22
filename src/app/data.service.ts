import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditLectureComponent } from './dialog/edit-lecture/edit-lecture.component';
// import {EventEmitter}  from 'events';
import { Final, Lesson, MyEventEmitter, Room, Row, SolveLec, Teacher, WeekDays } from './main/main/table/utility/static';
import { TableBinder } from './main/main/table/utility/tableBinder';
import { SoundService } from './sound.service';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  //!undo and redo are not consistent because dataService is not updated when they change table values
  public teachers: Teacher[] = [{ name: 'Ahmed Shaikh' },
  { name: 'Hassen' },
  { name: 'Hamzah' }];

  lessons: Lesson[] = [{ name: 'PM' },
  { name: 'HCI' },
  { name: 'Server-side' }];

  rooms: Room[] = [{ name: '301' },
  { name: '401' },
  { name: '302' }];

  public tableLecturesEvent = new MyEventEmitter();
  public tableLectures: SolveLec[] = [{
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

  public newLecContainer: SolveLec[] = [{
    startTime: -1, duration: 3, day: 'Friday', id: Math.random().toString(36).substring(2),
    lecture: { name: 'C++', teacher: 'Omer', weekDuration: -1, room: '233' }
  }, {
    startTime: -1, duration: 1, day: 'Friday', id: Math.random().toString(36).substring(2),
    lecture: { name: 'Java', teacher: 'Salem Hassen', weekDuration: -1, room: '233' }
  }];

  private flow: { curIndex: number, data: ({ teachers: Teacher[], lessons: Lesson[], rooms: Room[], tableLectures: SolveLec[], newLecContainer: SolveLec[] })[] } = { curIndex: -1, data: [] }

  private clipboard: SolveLec | undefined = undefined
  public focused: SolveLec | { index: number, day: WeekDays }|undefined = undefined;

  constructor(private sound: SoundService, private tableBinder: TableBinder, private final: Final,
    private dialog: MatDialog) {
    // setInterval(() => console.log(this.tableLectures[0]), 3000);
  }
  //VVVV dataService Functions VVVV
  /**
   * will save dataService variables into (flow) array to be return when undo or redo
   */
  public saveState = () => {//todo if after undo we saveState then 
    this.flow.data[this.flow.curIndex + 1] = JSON.parse(JSON.stringify({
      teachers: this.teachers,
      lessons: this.lessons,
      rooms: this.rooms,
      tableLectures: this.tableLectures,
      newLecContainer: this.newLecContainer
    }));
    this.flow.curIndex = ++this.flow.curIndex;
    this.flow.data.splice(this.flow.curIndex, this.flow.data.length - 1 - this.flow.curIndex);
    console.log('pushed index', this.flow.curIndex)
  }

  public undo = () => {
    if (this.flow.data[this.flow.curIndex - 1]) {
      const { teachers, lessons, rooms, tableLectures, newLecContainer } = JSON.parse(JSON.stringify(this.flow.data[--this.flow.curIndex]));
      this.teachers = teachers;
      this.lessons = lessons;
      this.rooms = rooms;
      this.tableLectures = tableLectures;
      this.tableLecturesEvent.emit('tableLecturesChanged');
      this.newLecContainer = newLecContainer;
      console.log('retain index', this.flow.curIndex)
    }
    else this.sound.play('notification');
  }

  public redo = () => {
    if (this.flow.data[this.flow.curIndex + 1]) {
      const { teachers, lessons, rooms, tableLectures, newLecContainer } = JSON.parse(JSON.stringify(this.flow.data[++this.flow.curIndex]));
      this.teachers = teachers;
      this.lessons = lessons;
      this.rooms = rooms;
      this.tableLectures = tableLectures;
      this.tableLecturesEvent.emit('tableLecturesChanged');
      this.newLecContainer = newLecContainer;

      console.log('retain index', this.flow.curIndex);
    } else this.sound.play('notification');
  }


  public editFocus() {
    if (!this.focused||'index' in this.focused)
    this.sound.play('notification')
  else this.edit(this.focused)
  }

  public edit(lecture: SolveLec): void {
    const ref = this.dialog.open(EditLectureComponent, {
      width: '800px',
      data: JSON.parse(JSON.stringify(lecture))
    });
    ref.afterClosed().subscribe(result => {
      if (this.tableLectures.includes(lecture)) {
        this.tableLectures.splice(this.tableLectures.indexOf(lecture), 1, result)
        this.tableLecturesEvent.emit('tableLecturesChanged');
      } else {
        this.newLecContainer.splice(this.newLecContainer.indexOf(lecture), 1, result);
      }
      this.saveState()
    });
  }

  public deleteFocus() {
    if (!this.focused||'index' in this.focused)
      this.sound.play('notification')
    else this.delete(this.focused)
  }
  public delete(lecture: SolveLec): void {
    console.log('delete called')
    if (this.tableLectures.includes(lecture)) {
      this.tableLectures.splice(this.tableLectures.indexOf(lecture), 1);
      this.tableLecturesEvent.emit('tableLecturesChanged');
    } else if (this.newLecContainer.includes(lecture)) {
      this.newLecContainer.splice(this.newLecContainer.indexOf(lecture), 1);
    } else throw new Error('what a lecture that not in tableLectures or newLecContainer')
    this.saveState();
  }

  public copyFocus() {
    if (!this.focused || 'index' in this.focused)
      this.sound.play('notification');
    else
      this.copy(this.focused)
  }

  public copy(lecture: SolveLec) {
    console.log('copy',lecture)
    this.clipboard = JSON.parse(JSON.stringify(lecture));//todo snackbar: copied
  }

  public cutFocus() {
    if (!this.focused || 'index' in this.focused) //typeof {{ index: number, day: WeekDays }
      this.sound.play('notification');
    else
      this.cut(this.focused);//todo snackbar: cutted
  }

  public cut(lecture: SolveLec) {
    console.log('cut',lecture)
    this.clipboard = JSON.parse(JSON.stringify(lecture));
    this.delete(lecture);
  }

  public pasteFocus() {
    if (this.focused && 'index' in this.focused)
      this.paste(this.focused);
    else this.sound.play('notification');
  }

  public paste(pos: { index: number, day: WeekDays }) {
    console.log('paste')
    console.log('row',this.tableBinder.lecsToRows(this.tableLectures))
    if (!this.clipboard)
      return this.sound.play('notification')
    let lecture: SolveLec = JSON.parse(JSON.stringify(this.clipboard));
    console.log('pos', { ...pos, startTime: this.getStartTime(pos.day, pos.index) });
    console.log('clipboard',this.clipboard)
    if (lecture && this.isAvailableSpace(pos.day,pos.index,lecture.duration)) {
      lecture.day = pos.day;
      lecture.startTime = this.getStartTime(pos.day, pos.index);
      
      if (lecture.startTime == -1)
        console.error('paste index is in critical position. come here');
      this.tableLectures.push(lecture);
      this.tableLecturesEvent.emit('tableLecturesChanged');
      this.saveState();
    } else this.sound.play('notification');
    //todo snackbar: clipboard empty
  }


  /********************************* PRIVATE METHODS *****************************************************/
  /**
   * 
   * @pram index for position in row
   * @returns boolean whether a lecture can be place in that day, index with its duration
   */
  private isAvailableSpace(day: WeekDays, index: number, duration: number): boolean {
    const row: Row = this.tableBinder.lecsToRows(this.tableLectures).filter(v => v.day == day)[0];
    for (let i = index; i < index + duration * 2; i++){
      if (row.tds.length <= i || row.tds[i] != null)
        return false;
    }
    return true;
  }
  /**
   * 
   * @param index of row.tds where row.day = @param day
   * @returns startTime of that index. -1 if not found
   */
  private getStartTime(day: WeekDays, index: number): number {
    const row: Row = this.tableBinder.lecsToRows(this.tableLectures).filter(v => v.day == day)[0];
    let st = this.final.START_TIME;
    for (let i = 0; i < row.tds.length; i++) {
      if (index == i)
        return st;
      let td =  row.tds[i];
      if (td && 'duration' in td)
        st += td.duration;
      else
        st += this.final.STEP_TIME
    }
    return -1;
  }


}
