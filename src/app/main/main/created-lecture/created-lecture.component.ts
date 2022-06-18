import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/data.service';
import { AddLectureComponent } from 'src/app/dialog/add-lecture/add-lecture.component';
import { Final } from '../table/utility/interface';

@Component({
  selector: 'app-created-lecture',
  templateUrl: './created-lecture.component.html',
  styleUrls: ['./created-lecture.component.css'],
  providers:[Final]
})
  
export class CreateLectureComponent  {
  constructor(public dialog: MatDialog, public dataService: DataService, public final: Final, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('moveable', sanitizer.bypassSecurityTrustHtml(this.final.SVG_moveable));
   }

  openAddNewLectureDialog() {
    this.dialog.open(AddLectureComponent, {
      width: '800px',
    });
  }

  drop(event:any) {
    console.log(this.final.SVG_moveable)
  }
}
