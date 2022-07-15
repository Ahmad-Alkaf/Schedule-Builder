import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorComponent } from '../dialog/error-msg/error.component';
import { Room, SolveLec, Subject, Teacher } from 'src/app/services/static';
import { Table } from 'src/app/services/tableBinder';
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
      if (JSON.stringify(this.tables) === JSON.stringify(tables))
        return resolve('');
      console.log('pushTables before http', tables);
      this.http.post('/api/table?token=' + await this.getToken(), tables).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.tables = [...tables];
            return resolve('');
          }
          else this.dialog.open(ErrorComponent, { data: { ...data, source: 'pushTables else data.success' } });
        }, error: data => this.dialog.open(ErrorComponent, { data: { ...data, source: 'error function pushTables of http req' } })
      });
    });
  }

  public pullTables(): Promise<TableData[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get<TableData[]>('/api/table?token=' + await this.getToken()).subscribe({
        next: (data: any) => {
          if (data.success != false && Array.isArray(data)) {
            console.log('pullTables', data);
            this.tables = [...data];
            return resolve(data);
          }
          return this.dialog.open(ErrorComponent, { data: { ...data, source: 'pullTables data.success= false' } });
        }, error: e => {
          this.dialog.open(ErrorComponent, { data: { ...e, source: 'e in pullTables' } })
        }
      });
    });
  }

  private pushContainer(container: SolveLec[]) {
    return new Promise(async (resolve, reject) => {
      if (JSON.stringify(this.container) === JSON.stringify(container))
        return resolve('');
      console.log('pushContainer before http', container);
      this.container = [...container];
      this.http.post('/api/container?token=' + await this.getToken(), container).subscribe({
        next: (data: any) => {
          if (data.success) {
            return resolve('');
          }
          else this.dialog.open(ErrorComponent, { data: { ...data, source: 'pushTables else data.success' } });
        }, error: data => this.dialog.open(ErrorComponent, { data: { ...data, source: 'error function pushTables of http req' } })
      });
    });
  }

  public pullContainer(): Promise<SolveLec[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get<SolveLec[]>('/api/container?token=' + await this.getToken()).subscribe({
        next: (data: any) => {
          if (data.success != false && Array.isArray(data)) {
            console.log('pullContainer', data);
            this.container = [...data];
            return resolve(data);
          } else this.dialog.open(ErrorComponent, { data: { ...data, source: 'pullContainer data.success= false' } });
        }, error: e => {
          this.dialog.open(ErrorComponent, { data: { ...e, source: 'e in pullContainer' } })
        }
      });
    });
  }
  private pushTeachers(teachers: Teacher[]): Promise<''> {
    return new Promise(async (resolve, reject) => {
      if (JSON.stringify(this.teachers) === JSON.stringify(teachers))
        return resolve('');
      this.http.post('/api/teacher?token=' + await this.getToken(), teachers).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.teachers = [...teachers];
            return resolve('');
          }
          else this.dialog.open(ErrorComponent, { data: { ...data, source: 'pushTeachers else data.success' } });
        }, error: data => this.dialog.open(ErrorComponent, { data: { ...data, source: 'error function pushTeachers of http req' } })
      });
    });
  }

  public pullTeachers(): Promise<Teacher[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get<Teacher[]>('/api/teacher?token=' + await this.getToken()).subscribe({
        next: (data: any) => {
          if (data.success != false && Array.isArray(data)) {
            console.log('pullTeachers', data);
            this.teachers = [...data];
            return resolve(data);
          }
          return this.dialog.open(ErrorComponent, { data: { ...data, source: 'pullTeachers data.success= false' } });
        }, error: e => this.dialog.open(ErrorComponent, { data: { ...e, source: 'e in pullTeachers' } })
      });
    });

  }

  private pushSubjects(subjects: Subject[]): Promise<''> {
    return new Promise(async (resolve, reject) => {
      if (JSON.stringify(this.subjects) === JSON.stringify(subjects))
        return resolve('');
      this.http.post('/api/subject?token=' + await this.getToken(), subjects).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.subjects = [...subjects];
            return resolve('');
          }
          else this.dialog.open(ErrorComponent, { data: { ...data, source: 'pushSubjects else data.success' } });
        }, error: data => this.dialog.open(ErrorComponent, { data: { ...data, source: 'error function pushSubjects of http req' } })
      });
    })
  }

  public pullSubjects(): Promise<Subject[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get<Room[]>('/api/subject?token=' + await this.getToken()).subscribe({
        next: (data: any) => {
          console.log('pullSubjects', data);
          if (data.success != false && Array.isArray(data)) {
            this.subjects = [...data];
            return resolve(data);
          }
          return this.dialog.open(ErrorComponent, { data: { ...data, source: 'pullSubjects data.success= false' } });
        }, error: e => {
          this.dialog.open(ErrorComponent, { data: { ...e, source: 'e in pullSubjects' } })
        }
      });
    });
  }

  private pushRooms(rooms: Room[]): Promise<''> {
    return new Promise(async (resolve, reject) => {
      if (JSON.stringify(this.rooms) === JSON.stringify(rooms))
        return resolve('');
      this.http.post('/api/room?token=' + await this.getToken(), rooms).subscribe((data: any) => {
        if (data.success) {
          this.rooms = [...rooms];
          return resolve('');
        }
        else this.dialog.open(ErrorComponent, { data: { ...data, source: 'pushRooms else data.success' } });
      }, data => this.dialog.open(ErrorComponent, { data: { ...data, source: 'error function pushRooms of http req' } }));
    });
  }


  public pullRooms(): Promise<Room[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get<Room[]>('/api/room?token=' + await this.getToken()).subscribe((data: any) => {
        console.log('pullRooms', data);
        if (data.success != false && Array.isArray(data)) {
          this.rooms = [...data];
          return resolve(data);
        }
        return this.dialog.open(ErrorComponent, { data: { ...data, source: 'pullRooms data.success= false' } });
      }, e => {
        this.dialog.open(ErrorComponent, { data: { ...e, source: 'e in pullRooms' } })
      });
    });
  }


  public token: string = '';
  private getToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (this.token != '' && await this.isValidToken(this.token))
        return resolve(this.token);

      let storage = localStorage.getItem('token');
      if (storage != null && await this.isValidToken(storage)) {
        this.token = storage;
        return resolve(storage);
      }
      if(window.location.href.includes('login')||window.location.href.includes('register')){}
      else window.location.href = '/login'

      // return await this.getTokenByLocalUserInfo();
    })
  }

  private isValidToken(token: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this.http.get('/api/token?token=' + token).subscribe({
        next: (data: any) => {
          if (data.success)
            return resolve(true);
          return resolve(false);
        }, error: () => resolve(false)
      });
    })
  }
  /**
   * return token by login to the server by user info in localStorage if exist else will redirect to login page
   */
  // private getTokenByLocalUserInfo(): Promise<string> {
  //   return new Promise(async (resolve, reject) => {//!doesn't work i thing 'cause two components execute this function at same time when load. for now just redirect to login
  //     let user = localStorage.getItem('user');
  //     try {
  //       if (user == null)
  //         return this.router.navigate(['/login']);
  //       // resolve(this.token);
  //       let _user: string = user;
  //       console.log('user', JSON.parse(user))
  //       let newToken = await this.login(JSON.parse(user))
  //       if (await this.isValidToken(newToken)) {
  //         this.token = newToken;
  //         localStorage.setItem('token', newToken);
  //         return resolve(newToken);
  //       }
  //     } catch (e: any) {
  //       alert('Remote login with account ' + user + ' failed to login ' + e.message + '! You should login manually')
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
      this.http.post('/api/token', user).subscribe({
        next: (res: any) => {
          console.log('response from get /api/token', res);
          if (res && res.success != false) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(user));
            return resolve(res.token);
          } else if (res && res.message) { reject(res) }
          else {
            this.dialog.open(ErrorComponent, { data: { ...res, user, source: 'login else' } });
            reject(res);
          }
        }, error: (e) => {
          this.dialog.open(ErrorComponent, { data: { ...e, source: 'login err func of http' } });
          reject(e);
        }
      });
    })
  }


  public register(newUser: any) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/user', newUser).subscribe({
        next: (res: any) => {
          if (res && res.success != false) {
            localStorage.setItem('token', res.token.token);
            localStorage.setItem('user', JSON.stringify({ username: res.added.username, password: res.added.password }));
            return resolve(res.token.token);
          } else if (res && res.message)
            return reject(res.message)
          else this.dialog.open(ErrorComponent, { data: { ...res, newUser, source: 'register last else' } })
        }, error: (e) => this.dialog.open(ErrorComponent, { data: { ...e, source: 'register error of http' } })
      })
    })
  }
}
