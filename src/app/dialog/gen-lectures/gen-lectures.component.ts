import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavTreeComponent } from '@page/main/nav-tree/nav-tree.component';
import { DataService } from '@service/data.service';
import { GenerateTableService } from '@service/generate-table.service';
import { Final, SolveLec, StaticLec, WEEK_DAYS } from '@service/static';
import { Table } from '@service/tableBinder';

interface ProStaticLec extends StaticLec {
  isUser: boolean;
}
@Component({
  selector: 'app-gen-lectures',
  templateUrl: './gen-lectures.component.html',
  styleUrls: ['./gen-lectures.component.scss']
})
export class GenLecturesComponent implements OnInit {
  public table: Table;
  constructor(public dialogRef: MatDialogRef<NavTreeComponent>, @Inject(MAT_DIALOG_DATA) data: Table
    , public dataService: DataService, private final: Final, private G: GenerateTableService,
    private snackbar: MatSnackBar) {
    this.table = data;
  }
  public staticLecs: ProStaticLec[] = [];
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
        } else if (st.weekDuration == -1)
          st.weekDuration = 0;
      if (exist == false) {
        this.staticLecs.push({ ...l, weekDuration: duration, isUser: false });
      }
    }
    console.log('static lecs', this.staticLecs)


    // this.dropdownChanged();
    this.staticLecs.push({ name: '', teacher: '', room: '', weekDuration: 0, isUser: true });
  }


  generate() {
    if (this.staticLecs.length <= 1 && this.isAddNew(this.staticLecs[this.staticLecs.length - 1])) {
      this.snackbar.open('You Should Specify at Least One Lecture!', undefined, { duration: 2000 })
      return;
    }

    if (this.isAddNew(this.staticLecs[this.staticLecs.length - 1])) {
      this.staticLecs.pop();
    }
    console.log('staticLecs', this.staticLecs);
    this.loading = true
    let solvedLecs = this.G.generateSchedule(this.staticLecs, this.solveLecs, this.dataService.tables.filter(v=>v == this.table))
    this.loading = false;
    console.log('G solution', solvedLecs)
    if (solvedLecs != undefined) {
      this.table.lectures = [...solvedLecs]
      this.dialogRef.close();
      this.dataService.saveState()
    }
    else this.snackbar.open('Could Not Generate Lectures 😞', undefined, { duration: 2000 })
  }

  isSolved(st: ProStaticLec): boolean {
    return this.solveLecs.some(({ lecture: l }) => l.name == st.name && l.teacher == st.teacher && l.room == st.room);
  }

  /**
   * (Add New) button will push new static lec with empty attrs and empty attrs can't be done only by it.
   * @param staticLecture
   * @returns whether st has empty attr or weekDuration less than one
   */
  isAddNew(staticLecture: ProStaticLec): boolean {
    if (staticLecture.name == '' || staticLecture.teacher == '' || staticLecture.room == '' || staticLecture.weekDuration <= 0)
      return true;
    return false;
  }

  /**
   * total of available hours in the table without consider existing lecture. there is 36 hours if table is with 6 days and each day from 8-2 O'clock i.e 6 hours
   */
  public totalAvailableHours = (this.final.START_TIMES[this.final.START_TIMES.length - 1] + this.final.STEP_TIME - this.final.START_TIME) * WEEK_DAYS.length;
  /**
   * @returns [1, 1.5, 2, ...n] where n = totalAvailableDuration - totalOccupiedDuration.
   */
  maxHourDuration(st: ProStaticLec): number {
    let totalOccupied = this.staticLecs.reduce((acc, v, i) => acc + v.weekDuration, 0);
    totalOccupied -= st.weekDuration;
    let availableDur = this.totalAvailableHours - totalOccupied;

    return availableDur;
  }


  /**
   * ex: start=1, end=3 @returns [1, 1.5, 2, 2.5, 3]; where step of each element is determine by Final.STEP_TIME.
   * @param start first element
   * @param end last element will added if step reach it
   */
  arr(start: number, end: number): number[] {
    if (end == start)
      return [start || end];
    if (start > end)
      return [];
    let validHours: number[] = [];
    for (let i = start; i <= end; i += this.final.STEP_TIME)
      validHours.push(i);
    return validHours;
  }

  usersStaticLecs(): ProStaticLec[] {
    return this.staticLecs.filter(v => v.isUser);
  }
  loading = false;
  disableGenerateButton() {
    return this.isAddNew(this.staticLecs[this.staticLecs.length - 1]) && this.staticLecs.filter(v => v.isUser == true).length <= 1;
  }
}