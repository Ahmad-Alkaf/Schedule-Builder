import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import {EventEmitter}  from 'events';
import { Subject, Room, Row, SolveLec, Teacher, WeekDays } from 'src/app/services/static';
import { Table } from 'src/app/services/tableBinder';
import { ApiService } from './api.service';
import { SoundService } from './sound.service';
import * as $ from 'JQuery';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  //!undo and redo are not consistent because dataService is not updated when they change table values
  public teachers: Teacher[] = [];

  subjects: Subject[] = [];

  rooms: Room[] = [];

  public tables: Table[] = [];

  public newLecContainer: SolveLec[] = [];

  private flow: { curIndex: number, data: ({ teachers: Teacher[], lessons: Subject[], rooms: Room[], tables: Table[], newLecContainer: SolveLec[] })[] } = { curIndex: -1, data: [] }


  constructor(private sound: SoundService, private api: ApiService, private snackbar: MatSnackBar, private dialog: MatDialog) {
    Promise.all([this.api.pullTables(), this.api.pullContainer()]).then(([tablesData, container]) => {
      console.log({ tablesData, container });
      this.newLecContainer = container;
      for (let i = 0; i < tablesData.length; i++) {
        this.tables.push(new Table(i, tablesData[i].name));
        this.tables[i].lectures = tablesData[i].lectures;
      }
      this.tabActiveIndex = 1;
      this.saveState();
      setTimeout(() => this.tabActiveIndex = 0);
    }).catch(e => console.error('dataService', e));

  }
  //VVVV dataService Functions VVVV
  /**
   * will save dataService variables into (flow) array to be return when undo or redo
   */
  public saveState = () => {
    //!fucking bug that won't let me save tables as other data
    this.flow.data[this.flow.curIndex + 1] = JSON.parse(JSON.stringify({
      teachers: this.teachers,
      lessons: this.subjects,
      rooms: this.rooms,
      tableLectures: this.tables.map(v => v.lectures),
      newLecContainer: this.newLecContainer,
      // tabActiveIndex: this.tabActiveIndex,
    }));
    this.flow.curIndex = ++this.flow.curIndex;
    this.flow.data.splice(this.flow.curIndex, this.flow.data.length - 1 - this.flow.curIndex);
    console.log('pushed index', this.flow.curIndex);
    this.checkCollision();
    if (this.tmp == true)
      this.api.SaveAll(this.tables, this.newLecContainer, this.teachers, this.rooms, this.subjects)
        .then(() => console.log('SAVED'))
        .catch(() => console.error("CATCH IN SAVING"));
    else this.tmp = true;
  }
  private tmp = false;
  public undo = () => {
    if (this.flow.data[this.flow.curIndex - 1]) {
      const { teachers, lessons, rooms, tableLectures, newLecContainer } = JSON.parse(JSON.stringify(this.flow.data[--this.flow.curIndex]));
      this.teachers = teachers;
      this.subjects = lessons;
      this.rooms = rooms;
      this.newLecContainer = newLecContainer;
      for (let i = 0; i < tableLectures.length; i++) {
        if (this.tables[i])
          this.tables[i].lectures = tableLectures[i];
      }
      this.checkCollision();
      this.api.SaveAll(this.tables, this.newLecContainer, this.teachers, this.rooms, this.subjects)
        .then(() => console.log('SAVED'))
        .catch(() => console.error("CATCH IN SAVING"));
      console.log('retain index', this.flow.curIndex);
    }
    else this.sound.play('notification');
  }

  public redo = () => {
    if (this.flow.data[this.flow.curIndex + 1]) {
      const { teachers, lessons, rooms, tableLectures, newLecContainer } = JSON.parse(JSON.stringify(this.flow.data[++this.flow.curIndex]));
      this.teachers = teachers;
      this.subjects = lessons;
      this.rooms = rooms;
      this.newLecContainer = newLecContainer;
      // this.tabActiveIndex = tabActiveIndex;
      for (let i = 0; i < tableLectures.length; i++)
        if (this.tables[i])
          this.tables[i].lectures = tableLectures[i];
      // else throw new Error(`wow you made it that far ok then come here handle me`);
      this.checkCollision();
      this.api.SaveAll(this.tables, this.newLecContainer, this.teachers, this.rooms, this.subjects)
        .then(() => console.log('SAVED'))
        .catch(() => console.error("CATCH IN SAVING"));
      console.log('retain index', this.flow.curIndex);
    } else this.sound.play('notification');
  }



  /**
   * 
   * @param lecture 
   * @returns Table object that contains @param lecture
   */
  public getTableOf(lecture: SolveLec): Table | 'container' {
    for (let table of this.tables)
      if (table.lectures.includes(lecture))
        return table;
    if (this.newLecContainer.includes(lecture))
      return 'container';
    throw new Error(`lecture is a copy that doesn't contained in any table either the container!`)
  }

  /**
   * the index table of the opened tab that user on
   */
  public tabActiveIndex: number = 0;
  /**
   * @returns the table of the opened tab that user on
   */
  public getActiveTable(): Table {
    return this.tables[this.tabActiveIndex];
  }


  /**
   * NOTE: if there is no lecture then at pram startTime this function will return -1.
   * @param startTime of lecture in row.tds where row.day = @param day
   * @returns index of that lecture in row.tds. -1 if not found
   */
  public getIndex(day: WeekDays, startTime: number): number {
    const row: Row = this.getActiveTable().rows.filter(v => v.day == day)[0];
    for (let i = 0; i < row.tds.length; i++) {
      let td = row.tds[i];
      if (td)
        if (td.startTime == startTime)
          return i;
        else if (td.startTime > startTime)
          break;
    }
    return -1;
  }

  /********************************* PRIVATE METHODS *****************************************************/



  private checkCollision() {
    console.log('check Collision')
    let tables = this.tables;
    for (let table of tables) {//init
      table.isCollide = false;
      for (let lec of table.lectures)
        lec.collision = [];
    }

    for (let i = 0; i < tables.length; i++)//setting
      for (let j = i + 1; j < tables.length; j++)
        for (let k = 0; k < tables[i].lectures.length; k++)
          for (let l = 0; l < tables[j].lectures.length; l++) {
            let lecture = tables[i].lectures[k];
            let lec = tables[j].lectures[l];
            if (lec.day != lecture.day)
              continue;
            if (lecture.startTime >= lec.startTime) {
              if (lec.startTime + lec.duration > lecture.startTime) {
                if (lec.lecture.room == lecture.lecture.room) {
                  lec.collision?.push('Room');
                  lecture.collision?.push('Room');
                  tables[i].isCollide = true;
                  tables[j].isCollide = true;
                }
                if (lec.lecture.teacher == lecture.lecture.teacher) {
                  lec.collision?.push('Teacher');
                  lecture.collision?.push('Teacher');
                  tables[i].isCollide = true;
                  tables[j].isCollide = true;
                }
              }
            } else if (lec.startTime >= lecture.startTime)
              if (lecture.startTime + lecture.duration > lec.startTime) {
                if (lec.lecture.room == lecture.lecture.room) {
                  lec.collision?.push('Room');
                  lecture.collision?.push('Room');
                  tables[i].isCollide = true;
                  tables[j].isCollide = true;
                }
                if (lec.lecture.teacher == lecture.lecture.teacher) {
                  lec.collision?.push('Teacher');
                  lecture.collision?.push('Teacher');
                  tables[i].isCollide = true;
                  tables[j].isCollide = true;
                }
              }
          }
    this.setTabCollide()
  }
  setTabCollide() {
    $(() => {
      let labels = $('mat-tab-header div.mat-tab-labels .mat-tab-label div.mat-tab-label-content');
      labels = labels.not(labels.last());
      let arr = labels.toArray();
      for (let i = 0; i < arr.length; i++)
        if (arr[i] && arr[i].innerText == this.tables[i].name)
          $(arr[i]).parent().removeClass('collide');

      for (let i = 0; i < this.tables.length; i++)
        if (arr[i])
          if (arr[i].innerText == this.tables[i].name) {
            let tab = $(arr[i]).parent();
            if (this.tables[i].isCollide)
              tab.addClass('collide');
          }

    })
  }
}
