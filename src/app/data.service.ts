import { Injectable } from '@angular/core';
export interface Teacher {
  name: string;
};
export interface Lesson {
  name: string;
};
export interface Room {
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class DataService {

  teachers: Teacher[] = [{ name: 'Ahmed Shaikh' },
  { name: 'Hassen' },
  { name: 'Hamzah' }];
  lessons: Lesson[] = [{ name: 'PM' },
  { name: 'HCI' },
  { name: 'Server-side' }];
  rooms: Room[] = [{ name: '301' },
  { name: '401' },
  { name: '302' }];
  constructor() { }
}
