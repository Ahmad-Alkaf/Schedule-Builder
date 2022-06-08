import { CdkDragDrop,moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { SolveLec, staticLecs, WeekDays } from './utility/index';
// import solve, {SolveLec, staticLecs} from './index';
import { table } from './utility/tableBinder'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  table = table;
  tableAttHeader: string[] = ['day', '8', '9', '10', '11', '12'];
  constructor() { }

  ngOnInit(): void {
    table.lecs = [{
      startTime: 8, duration: 1.5, day: 'Saturday',
      lecture: { name: 'Math', teacher: 'Ahmed', weekDuration: 6, room: '301' }
    }, {
      startTime: 10, duration: 1, day: 'Saturday',
      lecture: { name: 'Chemistry', teacher: 'Ali', weekDuration: 6, room: 'Lab 4' }
    }, {
      startTime: 12, duration: 1, day: 'Thursday',
      lecture: { name: 'PM', teacher: 'Hamza', weekDuration: 1, room: '401' }
    }, {
      startTime: 11, duration: 1.5, day: 'Wednesday',
      lecture: { name: "HCI", teacher: 'Ahmed', weekDuration: 1.5, room: '500' }
    },
    {
      startTime: 9, duration: 2, day: 'Wednesday',
      lecture: { name: 'Server-Side', teacher: 'Hassen', weekDuration: 2, room: '403' }
    },
    {
      startTime: 8, duration: 2, day: 'Sunday',
      lecture: { name: 'English', teacher: 'Abduallah', weekDuration: 3, room: '301' },
    },
    {
      startTime: 11, duration: 2, day: 'Sunday',
      lecture: { name: 'Database', teacher: 'Mohammed', weekDuration: 2, room: 'Lab 3' }
    }, {
      startTime: 8, duration: 2, day: 'Monday',
      lecture: { name: 'Organization', teacher: 'Mohsen', weekDuration: 3, room: 'Lab 4' }
    }, {
      startTime: 10, duration: 2, day: 'Monday',
      lecture: { name: 'Organization', teacher: 'Mohsen', weekDuration: 3, room: 'Lab 4' }
      }, {
      startTime: 12, duration: 1, day: 'Monday',
      lecture: { name: 'JavaScript', teacher: 'Omer', weekDuration: 2, room:'233'}
    }
    ];
    // console.log(table.rows);
  }
  // exTds:(string[])[] = [['111','222','333','444','555'],['one','two','three','four','five']]//,['one1','two2','three3','four4','five5'],['one11','two22','three33','four44','five55'],['11','22','33','44','55']]
  drop(event: CdkDragDrop<(SolveLec|null|'todoDelete')[]>) {//todo change type of event <string[]> to the object
    console.log(event)
    if (event.previousContainer === event.container) 
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
     else 
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    // fixRow
  }

}
