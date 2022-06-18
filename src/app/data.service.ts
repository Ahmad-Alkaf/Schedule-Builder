import { Injectable } from '@angular/core';
import { Lesson, Room, SolveLec, Teacher } from './main/main/table/utility/interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
//!undo and redo are not consistent because dataService is not updated when they change table values
  teachers: Teacher[] = [{ name: 'Ahmed Shaikh' },
  { name: 'Hassen' },
    { name: 'Hamzah' }];
  
  lessons: Lesson[] = [{ name: 'PM' },
  { name: 'HCI' },
    { name: 'Server-side' }];
  
  rooms: Room[] = [{ name: '301' },
  { name: '401' },
    { name: '302' }];
  
  tableLectures: SolveLec[] = [{
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
  newLecContainer: SolveLec[] = [ {
    startTime: -1, duration: 3, day: 'Friday', id: Math.random().toString(36).substring(2),
    lecture: { name: 'C++', teacher: 'Omer', weekDuration: -1, room: '233' }
  },{
    startTime: -1, duration: 3, day: 'Friday', id: Math.random().toString(36).substring(2),
    lecture: { name: 'Java', teacher: 'Salem Hassen', weekDuration: -1, room: '233' }
  }];
  constructor() { 
    // setInterval(() => console.log(this.tableLectures[0]), 3000);
  }
}
