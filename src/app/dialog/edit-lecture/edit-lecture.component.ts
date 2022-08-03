import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '@service/data.service';
import { NavTreeComponent } from '@main/nav-tree/nav-tree.component';
import { Final, Row, SolveLec } from '@service/static';

@Component({
  selector: 'app-edit-lecture',
  templateUrl: './edit-lecture.component.html',
  styleUrls: ['./edit-lecture.component.scss']
})
export class EditLectureComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<NavTreeComponent>, @Inject(MAT_DIALOG_DATA) public data: SolveLec,
    public dataService: DataService, public final: Final) {
  }
  ngOnInit(): void {
    this.validHours = this.validLectureHours();
  }
  validHours: number[] = [];
  form = new UntypedFormGroup({
    teacher: new UntypedFormControl(null),
    name: new UntypedFormControl(null, Validators.required),
    room: new UntypedFormControl(null),
    duration: new UntypedFormControl(null, Validators.required)
  });



  validLectureHours(): number[] {
    if (this.data.day == 'Friday' || this.data.startTime == -1)
      return this.final.LECTURE_DURATIONS;
    const hours = this.final.LECTURE_DURATIONS;
    const row: Row = this.dataService.getActiveTable().rows.filter(v => v.day == this.data.day)[0];
    const index: number = this.dataService.getIndex(row.day, this.data.startTime);
    let validHours: number[] = hours.filter(v => v <= this.data.duration);
    let dur = this.data.duration;
    for (let i = index + 1; i < row.tds.length && dur < this.final.MAX_LECTURE_DURATION; i++) {
      let td = row.tds[i];
      if (td)
        break;
      dur += this.final.STEP_TIME;
      validHours.push(dur);
    }
    return validHours;
  }
}
