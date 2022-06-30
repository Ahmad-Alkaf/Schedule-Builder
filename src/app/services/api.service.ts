import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorComponent } from '../dialog/error/error.component';
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

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) { }
  private tables: TableData[] = [];
  private container: SolveLec[] = [];
  private teachers: Teacher[] = [];
  private subjects: Subject[] = [];
  private rooms: Room[] = [];
  public async pushAll(tables: Table[], container: SolveLec[], teachers: Teacher[], rooms: Room[], subjects: Subject[]) {
    // console.log('pushAll',{tables,container,teachers,rooms,subjects})
    let tableData: TableData[] = [];
    for (let t of tables)
      tableData.push({ name: t.name, index: t.index, lectures: [...t.lectures] });
    await this.pushTables(tableData);
    await this.pushContainer(container);
    await this.pushTeachers(teachers);
    await this.pushSubjects(subjects);
    await this.pushRooms(rooms);
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

  private pushTeachers(teachers: Teacher[]): Promise<''> {
    return new Promise(async (resolve, reject) => {
      if (JSON.stringify(this.teachers) === JSON.stringify(teachers))
        return resolve('');
      this.teachers = teachers;
      this.http.post('/api/teacher?token=' + await this.getToken(), teachers).subscribe((data: any) => {
        if (data.success)
          return resolve('');
        else this.dialog.open(ErrorComponent, { data });
      }, data => this.dialog.open(ErrorComponent, { data }));
    });
  }

  public pullTeachers(): Promise<Teacher[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get<Teacher[]>('/api/teacher?token=' + await this.getToken()).subscribe((data: any) => {
        console.log('pullTeachers', data);
        if (data.success != false)
          return resolve(data);
        return this.dialog.open(ErrorComponent, { data:{...data,source:'pullTeachers data.success= false'} });
      }, e => {
         this.dialog.open(ErrorComponent, { data: { ...e, source: 'e in pullTeachers' } })
      });
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
      if (this.token != '' && await this.isValidToken(this.token))
        return resolve(this.token);
      
      let storage = localStorage.getItem('token');
      if (storage != null && await this.isValidToken(storage)) {
        this.token = storage;
        return resolve(storage);
      }
      
      return await this.getTokenByLocalUserInfo();
    })
  }

  private isValidToken(token: string): Promise<boolean> {
    return new Promise(async(resolve, reject) => {
      this.http.get('/api/token?token=' + token).subscribe((data: any) => {
        if (data.success)
          return resolve(true);
        return resolve(false);
      },()=>resolve(false));
    })
  }
  /**
   * return token by login to the server by user info in localStorage if exist else will redirect to login page
   */
  private getTokenByLocalUserInfo(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let user = localStorage.getItem('user');
      try {
        if (user != null) {
          console.log('user',JSON.parse(user))
          let newToken = await this.login(JSON.parse(user))
          if (await this.isValidToken(newToken)) {
            this.token = newToken;
            localStorage.setItem('token', newToken);
            return resolve(newToken);
          }else this.router.navigate(['/login']);
        }
      } catch { 
        console.error('catch called but not redirect!')
        this.router.navigate(['/login']);
      }

    })
  }

  /**
   * 
   * @param user 
   * @returns promise will resolve with token or reject with user friendly error message. Exception will halt this function and open error dialog i.e won't resolve nor reject
   */
  public login(user: { username: string, password: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.post('/api/token', user).subscribe((res: any) => {
        console.log('response from get /api/token', res);
        if (res && res.success != false) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(user));
          return resolve(res.token);
        } else if (res.message) { reject(res.message) }
        else this.dialog.open(ErrorComponent, { data: { ...res, user } });
      }, (e) => {return e && e.message? reject(e.message):this.dialog.open(ErrorComponent,{data:e}) });
    })
  }
}
