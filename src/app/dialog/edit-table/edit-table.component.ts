import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NavTreeComponent } from '@page/main/nav-tree/nav-tree.component';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.css']
})
export class EditTableComponent {

  tableControl = new FormControl('', Validators.maxLength(15));
  
  constructor(public dialogRef: MatDialogRef<NavTreeComponent>) { }

  addHandler() {
    if (this.tableControl.valid)
      this.dialogRef.close(this.tableControl.value);
    else 
    console.log('not valid',this.tableControl.value);
  }
}
