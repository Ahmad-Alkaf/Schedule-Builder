import { Component, Input, OnInit } from '@angular/core';
import { SolveLec } from '../utility';

@Component({
  selector: 'app-td',
  templateUrl: './td.component.html',
  styleUrls: ['./td.component.css']
})
export class TdComponent implements OnInit {
  @Input() td: SolveLec|null = null;
  constructor() { }

  ngOnInit(): void {
  }

}
