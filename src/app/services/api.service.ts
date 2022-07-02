import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { rejects } from 'assert';
import { resolve } from 'dns';
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
  /**
   * Don't use me with await i will me too slow 
   */
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
    
  }

  public pullTables(): Promise<TableData[]> {
    return new Promise((resolve, reject) => {
     
    })
  }
  private pushContainer(container: SolveLec[]) {
    
  }

  public pullContainer(): Promise<SolveLec[]> {
    return new Promise((resolve, reject) => {
      
    });
  }

  private pushTeachers(teachers: Teacher[]): Promise<''> {
    return new Promise(async (resolve, reject) => {
      this.http.post('/api/teacher?token=' + await this.getToken(), teachers).subscribe({
        next: (s: any) => {
          if (s && s.success != false) resolve('');
          else this.dialog.open(ErrorComponent, { data: { ...s, source: 'success=false in pushTeacher' } });
        }, error: (e) => this.dialog.open(ErrorComponent, { data: { ...e, source: 'error http pushTeachers' } })
      })
    });
  }

  public pullTeachers(): Promise<Teacher[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get<Teacher[]>('/api/teacher?token=' + await this.getToken()).subscribe({
        next: (data: any) => {
          console.log('pullTeachers', data);
          if (data.success != false)
            return resolve(data);
          reject(this.dialog.open(ErrorComponent, { data: { ...data, source: 'success false in pullTeachers' } }))
        }, error: e => {
          this.dialog.open(ErrorComponent, { data: { ...e, source: 'e in pullTeachers' } })
        }
      });
    });
  }

  private pushSubjects(subjects: Subject[]) {

  }

  private pushRooms(rooms: Room[]) {

  }

  public pullRooms() {

  }
  
  private token: string = '';
  private getToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (this.token != '' && await this.isValidToken(this.token))
        return resolve(this.token);

      let storage = localStorage.getItem('token');
      if (storage != null && (await this.isValidToken(storage))) {
        this.token = storage;
        return resolve(storage);
      }
      // return await this.getTokenByLocalUserInfo();
      this.router.navigate(['/login'])
    })
  }

  private isValidToken(token: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this.http.get('/api/token?token=' + token).subscribe({
        next: (data: any) => {
          if (data && data.success)
            resolve(true);
          else resolve(false);
        }, error: () => resolve(false)
      });
    })
  }
  /**
   * return token by login to the server by user info in localStorage if exist else will redirect to login page
   */
  // private getTokenByLocalUserInfo(): Promise<string> {
  //   return new Promise(async (resolve, reject) => {
  //     let user = localStorage.getItem('user');
  //     try {
  //       if (user != null) {
  //         console.log('user', JSON.parse(user))
  //         let newToken = await this.login(JSON.parse(user))
  //         if (await this.isValidToken(newToken)) {
  //           this.token = newToken;
  //           localStorage.setItem('token', newToken);
  //           return resolve(newToken);
  //         } else this.router.navigate(['/login']);
  //       }
  //     } catch {
  //       console.error('catch called but not redirect!')
  //       this.router.navigate(['/login']);
  //     }

  //   })
  // }

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
          this.token = res.token;
          // localStorage.setItem('user', JSON.stringify(user));
          return resolve(res.token);
        } else if (res.message) { reject(res.message) }
        else this.dialog.open(ErrorComponent, { data: { ...res, user } });
      }, (e) => { return e && e.message ? reject(e.message) : this.dialog.open(ErrorComponent, { data: e }) });
    })
  }
}
