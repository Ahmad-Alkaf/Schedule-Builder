import { Injectable } from '@angular/core';
// import {EventEmitter}  from 'events';
import { Lesson, MyEventEmitter, Room, SolveLec, Teacher } from './main/main/table/utility/interface';
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
    startTime: -1, duration: 3, day: 'Friday', id: Math.random().toString(36).substring(2),
    lecture: { name: 'Java', teacher: 'Salem Hassen', weekDuration: -1, room: '233' }
  }];

  private flow: { curIndex: number, data: ({teachers:Teacher[],lessons:Lesson[],rooms:Room[],tableLectures:SolveLec[],newLecContainer:SolveLec[]})[] } = { curIndex: -1, data: [] }

  

  constructor(private sound:SoundService) {
    // setInterval(() => console.log(this.tableLectures[0]), 3000);
  }
  //VVVV dataService Functions VVVV
  /**
   * will save dataService variables into (flow) array to be return when undo or redo
   */
  public saveState = () => {
    this.flow.data[this.flow.curIndex + 1] = JSON.parse(JSON.stringify({
      teachers: this.teachers,
      lessons: this.lessons,
      rooms: this.rooms,
      tableLectures: this.tableLectures,
      newLecContainer:this.newLecContainer
    }));
    this.flow.curIndex = ++this.flow.curIndex;
    this.flow.data.splice(this.flow.curIndex, this.flow.data.length - 1 - this.flow.curIndex);
    console.log('pushed index', this.flow.curIndex)
  }
  
  public undo = () => {
    if (this.flow.data[this.flow.curIndex - 1]) {
      const {teachers,lessons,rooms,tableLectures,newLecContainer} = JSON.parse(JSON.stringify(this.flow.data[--this.flow.curIndex]));
      this.teachers = teachers;
      this.lessons = lessons;
      this.rooms = rooms;
      this.tableLectures = tableLectures;
      this.newLecContainer = newLecContainer;
      this.tableLecturesEvent.emit('tableLecturesChanged');
      console.log('retain index', this.flow.curIndex)
    }
    else this.sound.play(this.sound.notification);
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
    } else this.sound.play(this.sound.notification);
  }
}
