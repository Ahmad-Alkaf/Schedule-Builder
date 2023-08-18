import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorComponent } from '@dialog/error-msg/error.component';
import { Room, SolveLec, Subject, Teacher } from '@service/static';
import { Table } from '@service/tableBinder';
interface TableData {
  index: number;
  name: string;
  lectures: SolveLec[];
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private snackbar: MatSnackBar) { }
  private tables: TableData[] = [];
  private container: SolveLec[] = [];
  private teachers: Teacher[] = [];
  private subjects: Subject[] = [];
  private rooms: Room[] = [];
  /**
   * don't await it will take long time
   */
  public async SaveAll(tables: Table[], container: SolveLec[], teachers: Teacher[], rooms: Room[], subjects: Subject[]) {
    // console.log('pushAll',{tables,container,teachers,rooms,subjects})
    let tableData: TableData[] = [];
    for (let t of tables) {
      tableData.push({ name: t.name, index: t.index, lectures: [...t.lectures] });
    }
    let _container: any = container
    for (let lec of _container) {
      lec.id = undefined;
      lec.lecture.id = undefined;

    }
    let _tableData: any = tableData;
    for (let t of _tableData)
      for (let lec of t.lectures) {
        lec.id = undefined;
        // lec.LectureId = undefined;
        // lec.TableDataId = undefined
        lec.lecture.id = undefined
      }

    await this.pushTeachers(teachers);
    await this.pushSubjects(subjects);
    await this.pushRooms(rooms);
    await this.pushContainer(container);
    await this.pushTables(tableData);
  }

  private pushTables(tables: TableData[]) {
    return new Promise(async (resolve, reject) => {
      localStorage.setItem('tables', JSON.stringify(tables));
      return resolve('');
    });
  }

  public pullTables(): Promise<TableData[]> {
    return new Promise(async (resolve, reject) => {
      return resolve(JSON.parse(localStorage.getItem('tables') ?? '[]'))
    });
  }

  private pushContainer(container: SolveLec[]) {
    return new Promise(async (resolve, reject) => {
      localStorage.setItem('container', JSON.stringify(container));
      return resolve('');
    });
  }

  public pullContainer(): Promise<SolveLec[]> {
    return new Promise(async (resolve, reject) => {
      return resolve(JSON.parse(localStorage.getItem('container') ?? '[]'));
    });
  }
  private pushTeachers(teachers: Teacher[]): Promise<''> {
    return new Promise(async (resolve, reject) => {
      localStorage.setItem('teachers', JSON.stringify(teachers));
      return resolve('');
    });
  }

  public pullTeachers(): Promise<Teacher[]> {
    return new Promise(async (resolve, reject) => {
      return resolve(JSON.parse(localStorage.getItem('teachers') ?? '[]'))
    });

  }

  private pushSubjects(subjects: Subject[]): Promise<''> {
    return new Promise(async (resolve, reject) => {
      localStorage.setItem('subjects', JSON.stringify(subjects));
      return resolve('');
    })
  }

  public pullSubjects(): Promise<Subject[]> {
    return new Promise(async (resolve, reject) => {
      return resolve(JSON.parse(localStorage.getItem('subjects') ?? '[]'))
    });
  }

  private pushRooms(rooms: Room[]): Promise<''> {
    return new Promise(async (resolve, reject) => {
      localStorage.setItem('rooms', JSON.stringify('rooms'))
      return resolve('');
    });
  }


  public pullRooms(): Promise<Room[]> {
    return new Promise(async (resolve, reject) => {
      return resolve(JSON.parse(localStorage.getItem('rooms') ?? '[]'))
    });
  }


  public token: string = '';
  private getToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      return 'local';
    })
  }

  public isValidToken(token: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      return true;
    })
  }

  /**
   *
   * @param user
   * @returns promise will resolve with token or reject with user friendly error message. Exception will halt this function and open error dialog i.e won't resolve nor reject
   */
  public login(user: { username: string, password: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      return 'noLogin'
    })
  }


  public register(newUser: any) {
    return new Promise((resolve, reject) => {
      // this.http.post('/api/user', newUser).subscribe({
      //   next: (res: any) => {
      //     if (res && res.success != false) {
      //       localStorage.setItem('token', res.token.token);
      //       localStorage.setItem('user', JSON.stringify({ username: res.added.username, password: res.added.password }));
      //       return resolve(res.token.token);
      //     } else if (res && res.message)
      //       return reject(res.message)
      //     else this.dialog.open(ErrorComponent, { data: { ...res, newUser, source: 'register last else' } })
      //   }, error: (e) => this.dialog.open(ErrorComponent, { data: { ...e, source: 'register error of http' } })
      // })
    })
  }
}
