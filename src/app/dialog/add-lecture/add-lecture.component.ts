import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '@service/data.service';
import { NavTreeComponent } from '@main/nav-tree/nav-tree.component';
import { GenerateTableService } from '@service/generate-table.service';
import { Final } from '@service/static';
@Component({
  selector: 'app-add-lecture',
  templateUrl: './add-lecture.component.html',
  styleUrls: ['./add-lecture.component.scss'],
})
export class AddLectureComponent implements OnInit {
  lecture: { name: string, teacher: string, room: string, duration: number } = { name: '', teacher: '', room: '', duration: -1 }
  constructor(private dialogRef: MatDialogRef<NavTreeComponent>,
    public dataService: DataService, public tableService: GenerateTableService, public final: Final) { }

  public form = new UntypedFormGroup({
    teacher: new UntypedFormControl(null),
    name: new UntypedFormControl(null, Validators.required),
    room: new UntypedFormControl(null),
    duration: new UntypedFormControl(null, Validators.required)
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
