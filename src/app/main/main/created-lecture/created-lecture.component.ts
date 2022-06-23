import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/services/data.service';
import { AddLectureComponent } from 'src/app/dialog/add-lecture/add-lecture.component';
import { Final, SolveLec } from '../table/utility/static';

@Component({
  selector: 'app-created-lecture',
  templateUrl: './created-lecture.component.html',
  styleUrls: ['./created-lecture.component.css'],
})

export class CreateLectureComponent {
  constructor(public dialog: MatDialog, public dataService: DataService, public final: Final) {
  }

  openAddNewLectureDialog=()=> {
    this.dialog.open(AddLectureComponent, {
      width: '800px',
    });
  }

  drop = (event: CdkDragDrop<(SolveLec)[]>) => {//todo emit('tableLecturesChanged'); saveState()
    let preTds: (SolveLec | null)[] = event.previousContainer.data;
    // let tds: (SolveLec | null)[] = event.container.data;
    let tdIndex: number = event.currentIndex;
    let tdPreIndex: number = event.previousIndex;
    let td: SolveLec | null = preTds[tdPreIndex];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (preTds != this.dataService.newLecContainer) {
        if (td) {
          // td.startTime = -1;
          this.dataService.newLecContainer.splice(tdIndex, 0, td);
          this.dataService.tableLectures.splice(this.dataService.tableLectures.indexOf(td), 1);
        } else throw new Error('unexpected value of td=' + td)

        this.dataService.tableLecturesEvent.emit('tableLecturesChanged');
      } else throw new Error('Unexpected dropped in created-lecture component!');//else if tds in table it'll call table drop
    }
    this.dataService.saveState()
  }
}
