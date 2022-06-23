import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { DialogRootTreeSubmit, NavTreeComponent } from '../../main/main/nav-tree/nav-tree.component'
@Component({
  selector: 'app-add-subtree',
  templateUrl: './add-subtree.component.html',
  styleUrls: ['./add-subtree.component.css']
})
export class AddSubtreeComponent {

  // constructor(public dialogRef: MatDialogRef<NavTreeComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: DialogRootTreeSubmit,) {
  //   data.title = data.title.replace('+ Add ', '');
  // }
  
  // AddHandler() {
  //   this.dialogRef.close(this.data);
  // }

  // closeDialog(): void {
  //   this.dialogRef.close();
  // }

}
