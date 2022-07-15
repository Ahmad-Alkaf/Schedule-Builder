import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { NavTreeComponent } from 'src/app/pages/main/nav-tree/nav-tree.component';
import { Final, Row, SolveLec } from 'src/app/services/static';

@Component({
  selector: 'app-edit-lecture',
  templateUrl: './edit-lecture.component.html',
  styleUrls: ['./edit-lecture.component.css']
})
export class EditLectureComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<NavTreeComponent>, @Inject(MAT_DIALOG_DATA) public data: SolveLec,
    public dataService: DataService, public final: Final) {
  }
  ngOnInit(): void {
    this.validHours = this.validLectureHours();
  }
  validHours: number[] = [];
  form = new FormGroup({
    teacher: new FormControl(null),
    name: new FormControl(null, Validators.required),
    room: new FormControl(null),
    duration: new FormControl(null, Validators.required)
  });



  validLectureHours(): number[] {
    if (this.data.day == 'Friday' || this.data.startTime == -1)
      return this.final.LECTURE_HOURS;
    const hours = this.final.LECTURE_HOURS;
    const row: Row = this.dataService.getActiveTable().rows.filter(v => v.day == this.data.day)[0];
    const index: number = this.dataService.getIndex(row.day, this.data.startTime);
    let validHours: number[] = hours.filter(v => v <= this.data.duration);
    let dur = this.data.duration;
    for (let i = index + 1; i < row.tds.length && dur < this.final.MAX_LECTURE_HOUR; i++) {
      let td = row.tds[i];
      if (td)
        break;
      dur += this.final.STEP_TIME;
      validHours.push(dur);
    }
    return validHours;
  }
}
