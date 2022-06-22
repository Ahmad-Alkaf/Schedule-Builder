import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/data.service';
import { NavTreeComponent } from 'src/app/main/main/nav-tree/nav-tree.component';
import { GenerateTableService } from 'src/app/main/main/table/utility/generate-table.service';
import { Final, SolveLec } from 'src/app/main/main/table/utility/static';

@Component({
  selector: 'app-edit-lecture',
  templateUrl: './edit-lecture.component.html',
  styleUrls: ['./edit-lecture.component.css']
})
export class EditLectureComponent {
  constructor(public dialogRef: MatDialogRef<NavTreeComponent>,@Inject(MAT_DIALOG_DATA) public data: SolveLec,
    public dataService: DataService, public tableService: GenerateTableService, public final: Final) { 
    console.log('editLec data', data);
    }

 
  
  editHandler() {
    this.dialogRef.close(this.data);
  }
}
