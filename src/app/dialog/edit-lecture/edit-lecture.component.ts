import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/data.service';
import { NavTreeComponent } from 'src/app/main/main/nav-tree/nav-tree.component';
import { Final, Row, SolveLec } from 'src/app/main/main/table/utility/static';
import { TableBinder } from 'src/app/main/main/table/utility/tableBinder';

@Component({
  selector: 'app-edit-lecture',
  templateUrl: './edit-lecture.component.html',
  styleUrls: ['./edit-lecture.component.css']
})
export class EditLectureComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<NavTreeComponent>, private tableBinder: TableBinder,
    @Inject(MAT_DIALOG_DATA) public data: SolveLec,
    public dataService: DataService, public final: Final) {
    console.log('editLec data', data);
  }
  ngOnInit(): void {
    this.validHours = this.validLectureHours();
  }
  validHours: number[] = [];




  validLectureHours(): number[] {
    const hours = this.final.LECTURE_HOURS;
    const row: Row = this.tableBinder.lecsToRows(this.dataService.tableLectures).filter(v => v.day == this.data.day)[0];
    const index: number = this.dataService.getIndex(row.day, this.data.startTime);
    console.log('index', index, ' of lecture', this.data);
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
