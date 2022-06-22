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
  public focused: SolveLec | { index: number, day: WeekDays } = { index: -1, day: 'Friday' };

  constructor(private sound: SoundService, private tableBinder: TableBinder, private final: Final,
              private dialog:MatDialog) {
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
      this.newLecContainer = newLecContainer;
      this.tableLecturesEvent.emit('tableLecturesChanged');
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
      this.newLecContainer = newLecContainer;
      this.tableLecturesEvent.emit('tableLecturesChanged');

      console.log('retain index', this.flow.curIndex);
    } else this.sound.play('notification');
  }


  public editFocus() {
    
  }

  public edit(lecture: SolveLec): void {
    const ref = this.dialog.open(EditLectureComponent, {
      width: '800px',
      data: JSON.parse(JSON.stringify(lecture))
    });
    ref.afterClosed().subscribe(result => {
      if (this.tableLectures.includes(lecture)) {
        this.tableLectures.splice(this.tableLectures.indexOf(lecture),1,result)
        this.tableLecturesEvent.emit('tableLecturesChanged');
      } else {
        this.newLecContainer.splice(this.newLecContainer.indexOf(lecture), 1, result);
      }
      this.saveState()
    });
  }

  public deleteFocus() {
    if ('index' in this.focused)
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
    if ('index' in this.focused)
      this.sound.play('notification');
    else
      this.clipboard = this.focused;//todo snackbar: copied
  }

  public copy(lecture: SolveLec) {
    this.clipboard = lecture;//todo snackbar: copied
  }

  public cutFocus() {
    if ('index' in this.focused) //typeof {{ index: number, day: WeekDays }
      this.sound.play('notification');
    else
      this.cut(this.focused);//todo snackbar: cutted
  }

  public cut(lecture: SolveLec) {
    this.clipboard = lecture;
    this.delete(lecture);
  }

  public pasteFocus() {
    if ('index' in this.focused)
      this.paste(this.focused);
    else this.sound.play('notification');
  }

  public paste(pos: { index: number, day: WeekDays }) {
    if (!this.clipboard)
      return this.sound.play('notification')
    let lecture:SolveLec = Object.create(this.clipboard);
    console.log('pos', pos);
    if (lecture) {
      let row: Row = this.tableBinder.lecsToRows(this.tableLectures).filter(v => v.day == pos.day)[0];
      lecture.day = row.day;
      let st = this.final.START_TIME
      for (let i = 0; i < row.tds.length;i++) {
        if (pos.index == i) {
          
          lecture.startTime = st;
          
          break;
        }
        st +=this.final.STEP_TIME
      }
      if (lecture.startTime != st)
        throw new Error('lecture is i do not know what happen come here');
      this.tableLectures.push(lecture);
      this.tableLecturesEvent.emit('tableLecturesChanged');
      this.saveState();
      console.log('looped')


    } else this.sound.play('notification')
    //todo snackbar: clipboard empty
  }
  
  
  /********************************* PRIVATE METHODS *****************************************************/
   /**
    * 
    * @pram index for position in row
    * @returns boolean whether a lecture can be place in that day, index with its duration
    */
    private isAvailableSpace(day:WeekDays,index:number, duration:number) {
      
    }
}
