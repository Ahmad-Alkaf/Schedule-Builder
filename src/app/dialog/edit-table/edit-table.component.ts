import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavTreeComponent } from '@page/main/nav-tree/nav-tree.component';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss']
})
export class EditTableComponent implements OnInit {

  tableControl = new UntypedFormControl('', Validators.maxLength(15));

  constructor(public dialogRef: MatDialogRef<NavTreeComponent>, @Inject(MAT_DIALOG_DATA) public prevTableName: string) { }
  ngOnInit(): void {
    this.tableControl.setValue(this.prevTableName)
  }

  addHandler() {
    if (this.tableControl.valid)
      this.dialogRef.close(this.tableControl.value);
    else
      console.log('not valid', this.tableControl.value);
  }
}
