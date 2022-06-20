import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { GenerateTableService } from '../utility/generate-table.service';
import { SolveLec,Final } from '../utility/interface';
@Component({
  selector: 'app-td',
  templateUrl: './td.component.html',
  styleUrls: ['./td.component.css'],
  providers:[Final]
})
export class TdComponent implements OnInit {
  @Input() td: SolveLec|null = null;
  @Input() isTable: boolean = false;
  constructor(public tableService:GenerateTableService,public final:Final) { }

  ngOnInit(): void {
  }

}
