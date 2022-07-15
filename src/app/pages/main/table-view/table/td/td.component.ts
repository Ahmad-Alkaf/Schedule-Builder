import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GenerateTableService } from 'src/app/services/generate-table.service';
import { SolveLec,Final } from 'src/app/services/static';
@Component({
  selector: 'app-td',
  templateUrl: './td.component.html',
  styleUrls: ['./td.component.css'],
})
export class TdComponent implements OnInit {
  @Input() td: SolveLec|null = null;
  constructor(public tableService:GenerateTableService,public final:Final,public dataService:DataService) { }

  ngOnInit(): void {
  }

  time(n: number):string {
    let s: string = n.toString();
    if (!s.includes('.'))
      return s;
    let [hour,min]= s.split('.');
    return hour + ':' + (Number(min) * 6);
  }
}
