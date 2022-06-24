import { Injectable } from '@angular/core';
import { Room, Subject, Teacher } from '../main/main/table/utility/static';
import { Table } from '../main/main/table/utility/tableBinder';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
  
  public pushTables(tables:Table[]) {
    localStorage.setItem('tables',JSON.stringify(tables))
  }
  
  public pullTables(): Table[] {
    let str = localStorage.getItem('tables');
    return str ? JSON.parse(str) : [];
  }
  
  public pushTeachers(teachers: Teacher[]) {
    localStorage.setItem('teachers',JSON.stringify(teachers))
  }
  
  public pullTeachers(): Teacher[]{
    let str = localStorage.getItem('teachers');
    return str ? JSON.parse(str) : [];
  }
  
  public pushSubjects(subjects: Subject[]) {
    localStorage.setItem('subjects',JSON.stringify(subjects))
  }
  
  public pullSubjects(): Subject[]{
    let str = localStorage.getItem('subjects');
    return str ? JSON.parse(str) : [];
  }
  
  public pushRooms(rooms: Room[]) {
    localStorage.setItem('rooms',JSON.stringify(rooms))
  }
  
  public pullRooms(): Room[]{
    let str = localStorage.getItem('rooms');
    return str ? JSON.parse(str) : [];
  }
}
