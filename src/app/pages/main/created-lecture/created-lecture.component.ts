import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { AddLectureComponent } from 'src/app/dialog/add-lecture/add-lecture.component';
import { Final, SolveLec } from '../table/utility/static';
import { ControlLectureService } from 'src/app/services/control-lecture.service';

@Component({
  selector: 'app-created-lecture',
  templateUrl: './created-lecture.component.html',
  styleUrls: ['./created-lecture.component.css'],
})

export class CreateLectureComponent {
  constructor(public dialog: MatDialog, public dataService: DataService, public final: Final,public lecControl:ControlLectureService) {
  }

  openAddNewLectureDialog = () => {
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
          let table = this.dataService.getActiveTable();
          let lecs = [...table.lectures];
          lecs.splice(table.lectures.indexOf(td), 1);
          table.lectures = lecs;
          this.dataService.saveState();
        } else throw new Error('unexpected value of td=' + td)
        // this.dataService.sync.emit('tableLecturesChanged');
      } else throw new Error('Unexpected dropped in created-lecture component!');//else if tds in table it'll call table drop
    }
    this.dataService.saveState()
  }
  connectTables(): string[] {
    let arr: string[] = [];
    for (let table of this.dataService.tables)
      for (let i = 0; i < table.rows.length; i++)
        arr.push('row' + table.index + i);
    return arr;
  }
}
