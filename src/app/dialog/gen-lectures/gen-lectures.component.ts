import { Component, Inject, OnInit } from '@angular/core';
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

  constructor(public dialogRef: MatDialogRef<NavTreeComponent>, @Inject(MAT_DIALOG_DATA) public data: Table
    , public dataService: DataService,private final:Final) { }
  public staticLecs: StaticLec[] = [];
  public solveLecs: SolveLec[] = [];
  public temp: StaticLec = {name:'',teacher:'',room:'',weekDuration:0};
  ngOnInit(): void {
    this.solveLecs = JSON.parse(JSON.stringify(this.data.lectures))
    
  }
  generate() {

  }
  validHourDuration(): number[]{
    let totalDur = this.data.lectures.reduce((acc, l) => l.duration + acc, 0);
    console.log(`GenLecturesComponent : validHourDuration : totalDur`, totalDur)
    let totalAva = (this.final.START_TIMES[this.final.START_TIMES.length-1] - this.final.START_TIME) * WEEK_DAYS.length;
    console.log(`GenLecturesComponent : validHourDuration : totalAva`, totalAva)
    let availableDur = totalAva - totalDur;
    let validHours: number[] = [];
    for (let i = 1; i < availableDur; i++)
      validHours.push(i);
    console.log('validHours', validHours);
    return validHours
  }
}
