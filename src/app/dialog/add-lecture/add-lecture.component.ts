import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/data.service';
import { NavTreeComponent } from 'src/app/main/main/nav-tree/nav-tree.component';
import { GenerateTableService } from 'src/app/main/main/table/utility/generate-table.service';
import { Final } from 'src/app/main/main/table/utility/static';
@Component({
  selector: 'app-add-lecture',
  templateUrl: './add-lecture.component.html',
  styleUrls: ['./add-lecture.component.css'],
})
export class AddLectureComponent implements OnInit {
  lecture: { name: string, teacher: string, room: string, duration: number } = { name: '', teacher: '', room: '', duration: -1 }
  constructor(private dialogRef: MatDialogRef<NavTreeComponent>,
    public dataService: DataService, public tableService: GenerateTableService, public final: Final) { }

  form = new FormGroup({
    teacher: new FormControl(null),
    name: new FormControl(null, Validators.required),
    room: new FormControl(null),
    duration: new FormControl(null, Validators.required)
  })
  ngOnInit(): void {

  }

  AddHandler() {
    console.log('form', this.form)
    if (this.form.valid) {
      const { name, teacher, duration, room } = this.form.value;
      
      this.dataService.newLecContainer.push({
        startTime: -1, duration, day: 'Friday', id: Math.random().toString(36).substring(2),
        lecture: { name, teacher, room, weekDuration: -1 },
      });
      this.dataService.saveState();
      console.log('newLecContainer', this.dataService.newLecContainer);
      this.dialogRef.close(null);

    }
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

}
