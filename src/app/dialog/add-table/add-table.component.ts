import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NavTreeComponent } from '@main/nav-tree/nav-tree.component';

@Component({
  selector: 'app-add-table',
  templateUrl: './add-table.component.html',
  styleUrls: ['./add-table.component.css']
})
export class AddTableComponent  {
  tableControl = new FormControl('', Validators.maxLength(15));
  
  constructor(public dialogRef: MatDialogRef<NavTreeComponent>) { }

  addHandler() {
    if (this.tableControl.valid)
      this.dialogRef.close(this.tableControl.value);
    else 
    console.log('not valid',this.tableControl.value);
  }

}
