import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Room, SolveLec, Subject, Teacher } from '../main/main/table/utility/static';
import { Table } from '../main/main/table/utility/tableBinder';
import { DataService } from './data.service';
interface TableData {
  index: number;
  name: string;
  lectures: SolveLec[];
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router) { }
  private tables: TableData[] = [];
  private container: SolveLec[] = [];
  private teachers: Teacher[] = [];
  private subjects: Subject[] = [];
  private rooms: Room[] = [];
  public pushAll(tables: Table[], container: SolveLec[], teachers: Teacher[], rooms: Room[], subjects: Subject[]) {
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
  private pushTables(tables: TableData[]) {
    if (JSON.stringify(this.tables) === JSON.stringify(tables))
      return;

    this.tables = tables;
    localStorage.setItem('tables', JSON.stringify(tables))
  }

  public pullTables(): Promise<TableData[]> {
    return new Promise((resolve, reject) => {
      let str = localStorage.getItem('tables');
      this.tables = str ? JSON.parse(str) : [];
      resolve(str ? JSON.parse(str) : [])
    })
  }
  private pushContainer(container: SolveLec[]) {
    if (JSON.stringify(this.container) === JSON.stringify(container))
      return;
    // console.log('pushed container')
    this.container = container;
    localStorage.setItem('container', JSON.stringify(container))
  }

  public pullContainer(): Promise<SolveLec[]> {
    return new Promise((resolve, reject) => {
      let str = localStorage.getItem('container');
      this.container = str ? JSON.parse(str) : [];
      resolve(str ? JSON.parse(str) : []);
    })
  }

  private pushTeachers(teachers: Teacher[]) {
    return new Promise(async (resolve, reject) => {
      this.http.post('/api/teacher?token=' + await this.getToken(), teachers).subscribe((res: any) => {
        if (res.success)
          resolve()
      })
    })
    if (JSON.stringify(this.teachers) === JSON.stringify(teachers))
      return;
    console.log('pushed teachers', teachers.find(v => v.id == undefined))

    this.teachers = teachers;
    localStorage.setItem('teachers', JSON.stringify(teachers))
  }

  public pullTeachers(): Promise<Teacher[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get<Teacher[]>('/api/teacher?token=' + await this.getToken()).subscribe((data: any) => {
        console.log(data);
        if (data.success)
          resolve(data);
        else return this.
      }, e => reject(e));
    });

  }

  private pushSubjects(subjects: Subject[]) {
    if (JSON.stringify(this.subjects) === JSON.stringify(subjects))
      return;
    // console.log('pushed subjects')
    this.subjects = subjects;
    localStorage.setItem('subjects', JSON.stringify(subjects))
  }

  public pullSubjects(): Promise<Subject[]> {
    return new Promise((resolve, reject) => {
      let str = localStorage.getItem('subjects');
      this.subjects = str ? JSON.parse(str) : [];
      resolve(str ? JSON.parse(str) : []);

    })
  }

  private pushRooms(rooms: Room[]) {
    if (JSON.stringify(this.rooms) === JSON.stringify(rooms))
      return;
    // console.log('pushed rooms')
    this.rooms = rooms;
    localStorage.setItem('rooms', JSON.stringify(rooms))
  }

  public pullRooms(): Promise<Room[]> {
    return new Promise((resolve, reject) => {
      let str = localStorage.getItem('rooms');
      this.rooms = str ? JSON.parse(str) : [];
      resolve(str ? JSON.parse(str) : []);
    })
  }
  private token: string = '';
  private getToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (this.token != '')
        return resolve(this.token);
      let token = localStorage.getItem('token');
      if (token != null) {
        this.token = token;
        return resolve(token);
      }
      let user = localStorage.getItem('user');
      if (user != null) {
        let newToken = await this.login(JSON.parse(user));
        if (newToken != '') {
          this.token = newToken;
          return resolve(newToken);
        }
      }

      this.router.navigate(['/login']);
    })
  }

  public login(user: { username: string, password: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.post('/api/token', user).subscribe((res: any) => {
        console.log('response from get /api/token', res);
        if (res && res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(res.token);
        } else { console.log('error while login', res); resolve('') }
      });
    })
  }
}
