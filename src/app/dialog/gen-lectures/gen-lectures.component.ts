import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavTreeComponent } from '@page/main/nav-tree/nav-tree.component';
import { DataService } from '@service/data.service';
import { Final, SolveLec, StaticLec, WEEK_DAYS } from '@service/static';
import { Table } from '@service/tableBinder';

@Component({
  selector: 'app-gen-lectures',
  templateUrl: './gen-lectures.component.html',
  styleUrls: ['./gen-lectures.component.scss']
})
export class GenLecturesComponent implements OnInit {
  public table: Table;
  constructor(public dialogRef: MatDialogRef<NavTreeComponent>, @Inject(MAT_DIALOG_DATA) data: Table
    , public dataService: DataService, private final: Final) {
    this.table = data;
  }
  public staticLecs: StaticLec[] = [];
  private solveLecs: SolveLec[] = [];

  ngOnInit(): void {
    this.solveLecs = [...this.table.lectures]
    // JSON.parse(JSON.stringify(
    // ));
    for (let { lecture: l, duration } of this.solveLecs) {
      let exist = false;
      for (let st of this.staticLecs)
        if (st.name == l.name && st.teacher == l.teacher && st.room == l.room) {
          st.weekDuration += duration;
          exist = true;
          break;
        }
      if (exist == false) {
        this.staticLecs.push({ ...l, weekDuration: duration });
      }
    }
    console.log('static lecs', this.staticLecs)


    // this.dropdownChanged();
    // this.staticLecs.push({ name: '', teacher: '', room: '', weekDuration: 0 });
  }
  generate() {

  }

  isSolved(st: StaticLec):boolean {
    return this.solveLecs.some(({ lecture:l }) => l.name == st.name && l.teacher == st.teacher && l.room == st.room );
  }

  // validStaticLec(st: StaticLec): boolean {
  //   if (st.name != '' && st.teacher != '' && st.room != '' && st.weekDuration > 0) {
  //     if (!this.dataService.subjects.value.some(v => v.name == st.name))
  //       return false;
  //     if (!this.dataService.teachers.value.some(v => v.name == st.teacher))
  //       return false;
  //     if (!this.dataService.rooms.value.some(v => v.name == st.room))
  //       return false;
  //     return true;
  //   }

  //   return false;
  // }
  
  isAddNew(st: StaticLec): boolean {// to add new static lec the dropdownChanged() will push new static lec that has empty attrs and empty attrs can't be done only by it.
    if (st.name == '' || st.teacher == '' || st.room == '' || st.weekDuration <= 0)
      return true;
    return false;
  }
  
  public totalAvailableHours = (this.final.START_TIMES[this.final.START_TIMES.length - 1] + this.final.STEP_TIME - this.final.START_TIME) * WEEK_DAYS.length;
  /**
   * @returns [1, 1.5, 2, ...n] where n = totalAvailableDuration - totalOccupiedDuration.
   */
  validHourDuration(): number[] {
    let totalDur = this.staticLecs.reduce((acc, v, i) => acc + v.weekDuration, 0);
    totalDur -= this.staticLecs[this.staticLecs.length - 1].weekDuration;
    // // console.log(`GenLecturesComponent : validHourDuration : totalDur`, totalDur)
    // // console.log(`GenLecturesComponent : validHourDuration : totalAva`, totalAva)
    let availableDur = this.totalAvailableHours - totalDur;
    
    
    // console.log('validHours', validHours);
    return this.arr(1, this.final.STEP_TIME, availableDur);
  }
  
  /**
   * ex: start=1,step=2,end=6 @returns [1,3,5]
   * @param start first element
   * @param step each iteration step
   * @param end last element
   */
  arr(start: number, step: number, end: number): number[]{
    let validHours: number[] = [];
    for (let i = start; i <= end; i += step)
      validHours.push(i);
    return validHours;
  }
}
