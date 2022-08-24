import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Prompt, PromptComponent } from '@dialog/prompt/prompt.component';
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
    , public dataService: DataService, public final: Final, private G: GenerateTableService,
    private snackbar: MatSnackBar, private dialog: MatDialog) {
    this.table = data;
  }
  public staticLecs: ProStaticLec[] = [];
  private solveLecs: SolveLec[] = [];

  ngOnInit(): void {
    //to terminate lectures generator when dialog closed if it processing
    this.dialogRef.beforeClosed().subscribe({ next: () => this.G.terminate() });

    this.solveLecs = [...this.table.lectures];//solveLecs predefined lectures on the table
    
    //get existing schedule's lectures into staticLectures
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
    console.log('existing static lecs', this.staticLecs)

    //html will show dropdowns list to "addNew" staticLecs. Actually it is empty staticLecs
    this.staticLecs.push({ name: '', teacher: '', room: '', weekDuration: 0, isUser: true });
  }

  
  //will called when click (Generate) button
  async generateIntro() {
    if (this.staticLecs.length <= 1 && this.isAddNew(this.staticLecs[this.staticLecs.length - 1])) {
      this.snackbar.open('You Should Specify at Least One Lecture!', undefined, { duration: 2000 })
      return;
    }
    // get rid of empty staticLec that added to make user "addNew" staticLec
    if (this.isAddNew(this.staticLecs[this.staticLecs.length - 1])) {
      this.staticLecs.pop();
    }
    console.log('staticLecs', this.staticLecs);
    this.loading = true
    try {
      let solvedLecs = await this.G.generateLectures(this.staticLecs, this.solveLecs, this.dataService.tables);
      this.loading = false;
      console.log('Generated lectures=', solvedLecs)
      if (solvedLecs != null) {
        this.table.lectures = [...solvedLecs]
        this.snackbar.open('Successfully Generated!',undefined,{duration:3000})
        this.dialogRef.close();
        this.dataService.saveState()
      }
      else this.snackbar.open('Impossible to Generate the Lectures😞', undefined, { duration: 2000 })
    } catch (msg: any) {
      this.snackbar.open(msg ?? "Something went wrong!", undefined, { duration: 2500 });
    }

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
    let maxHoursWeekCouldLecture = this.final.MAX_LECTURE_DURATION * WEEK_DAYS.length;
    
    return (maxHoursWeekCouldLecture < availableDur ? maxHoursWeekCouldLecture : availableDur) - this.weekDuration(st);
  ;
    // console.log(availableDur);
    // return availableDur
    
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

  /**
   * 
   * @param staticLec 
   * @param dur 
   * @returns if there is same lecture(STR(Subject,Teacher,Room)) in the table then disable invalid hours
   */
  disableHour(s: ProStaticLec, dur: number): boolean {
    for (let stat of this.staticLecs)
      if (stat != s && stat.name == s.name && stat.teacher == s.teacher && stat.room == s.room)
        if (stat.weekDuration >= dur)
          return true;
    return false;

  }
  /**
   * 
   * @param s addNew lecture not reference
   * @returns the weekDuration of STR equal staticLec in staticLecs list OR 0 if not found
   */
  weekDuration(s: ProStaticLec) {
    let x =this.staticLecs.filter((v) => v.name == s.name && v.room == s.room && v.teacher == s.teacher);
    return x[0]?.weekDuration ?? 0;
  }
  
  
  howMessage = `Generate lectures base on determine week duration. So, the sum of all 
  generated lectures will be the week duration. If there are lectures on 
  the table, then generated lectures will be appended. And existing lectures 
  will be constant i.e(won't be change). If you generate lectures
  that exists on the table i.e(Same subject, teacher, and room) then week 
  duration will add up. Note: You can't generate lecture with duration smaller 
  than minimum lecture duration. So, week duration should be longer for generated lecture`;
  FAQ() {
    let data: Prompt = {
      title: { text: 'How to Generate Lectures ?', color: 'var(--primary-color)' },
      content: this.howMessage
    }
    this.dialog.open(PromptComponent, {
      width: '500px',
      data
    });
  }
  loading = false;
  disableGenerateButton() {
    return this.isAddNew(this.staticLecs[this.staticLecs.length - 1]) && this.staticLecs.filter(v => v.isUser == true).length <= 1;
  }
}