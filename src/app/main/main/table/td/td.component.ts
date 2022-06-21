import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { GenerateTableService } from '../utility/generate-table.service';
import { SolveLec,Final } from '../utility/static';
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

}
