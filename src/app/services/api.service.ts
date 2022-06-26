import { Injectable } from '@angular/core';
import { Room, SolveLec, Subject, Teacher } from '../main/main/table/utility/static';
import { Table } from '../main/main/table/utility/tableBinder';
import { DataService } from './data.service';
interface TableData{
  index: number;
  name: string;
  lectures: SolveLec[];
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
  private tables: TableData[] = [];
  private container: SolveLec[] = [];
  private teachers: Teacher[] = [];
  private subjects: Subject[] = [];
  private rooms: Room[] = [];
  public pushAll(tables:Table[],container:SolveLec[],teachers:Teacher[],rooms:Room[],subjects:Subject[]) {
    // console.log('pushAll',{tables,container,teachers,rooms,subjects})
    let tableData: TableData[] = [];
    for (let t of tables)
      tableData.push({ name: t.name, index: t.index, lectures: [...t.lectures] });
    this.pushTables(tableData);
    this.pushContainer(container);
    this.pushTeachers(teachers);
    this.pushSubjects(subjects);
    this.pushRooms(rooms);
  }
  public pullAll():{tables:TableData[],container:SolveLec[],teachers:Teacher[],subjects:Subject[],rooms:Room[]} {
    return {
      tables: this.pullTables(),
      container:this.pullContainer(),
      teachers: this.pullTeachers(),
      subjects: this.pullSubjects(),
      rooms: this.pullRooms()
    }
  }
  private pushTables(tables: TableData[]) {
    if (JSON.stringify(this.tables) === JSON.stringify(tables))
      return;
    // console.log('pushed tables')
    this.tables = tables;
    localStorage.setItem('tables',JSON.stringify(tables))
  }
  
  private pullTables(): TableData[] {
    let str = localStorage.getItem('tables');
    this.tables = str ? JSON.parse(str) : [];
    return str ? JSON.parse(str) : [];
  }
  private pushContainer(container: SolveLec[]) {
    if (JSON.stringify(this.container) === JSON.stringify(container))
      return;
    // console.log('pushed container')
    this.container = container;
    localStorage.setItem('container',JSON.stringify(container))
  }
  
  private pullContainer(): SolveLec[] {
    let str = localStorage.getItem('container');
    this.container = str ? JSON.parse(str) : [];
    return str ? JSON.parse(str) : [];
  }
  
  private pushTeachers(teachers: Teacher[]) {
    if (JSON.stringify(this.teachers) === JSON.stringify(teachers))
      return;
      // console.log('pushed teachers')

    this.teachers = teachers;
    localStorage.setItem('teachers',JSON.stringify(teachers))
  }
  
  private pullTeachers(): Teacher[]{
    let str = localStorage.getItem('teachers');
    this.teachers = str ? JSON.parse(str) : [];
    return str ? JSON.parse(str) : [];
  }
  
  private pushSubjects(subjects: Subject[]) {
    if (JSON.stringify(this.subjects) === JSON.stringify(subjects))
      return;
    // console.log('pushed subjects')
  this.subjects = subjects;
    localStorage.setItem('subjects',JSON.stringify(subjects))
  }
  
  private pullSubjects(): Subject[]{
    let str = localStorage.getItem('subjects');
    this.subjects = str ? JSON.parse(str) : [];
    return str ? JSON.parse(str) : [];
  }
  
  private pushRooms(rooms: Room[]) {
    if (JSON.stringify(this.rooms) === JSON.stringify(rooms))
      return;
    // console.log('pushed rooms')
  this.rooms = rooms;
    localStorage.setItem('rooms',JSON.stringify(rooms))
  }
  
  private pullRooms(): Room[]{
    let str = localStorage.getItem('rooms');
    this.rooms = str ? JSON.parse(str) : [];
    return str ? JSON.parse(str) : [];
  }
}
