import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRootTreeSubmit, NavTreeComponent } from 'src/app/main/main/nav-tree/nav-tree.component';

@Component({
  selector: 'app-add-lecture',
  templateUrl: './add-lecture.component.html',
  styleUrls: ['./add-lecture.component.css']
})
export class AddLectureComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NavTreeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogRootTreeSubmit,) { }
  
  lectureControl = new FormControl(null, Validators.required);
  ngOnInit(): void {
  }

}
