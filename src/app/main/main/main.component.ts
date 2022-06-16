import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddLectureComponent } from 'src/app/dialog/add-lecture/add-lecture.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  
  constructor(public dialog:MatDialog) { }

  openAddNewLectureDialog() {
    const dialogRef = this.dialog.open(AddLectureComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result?.name)
      console.log('The dialog was closed with data=', result);
    });
  }

}
