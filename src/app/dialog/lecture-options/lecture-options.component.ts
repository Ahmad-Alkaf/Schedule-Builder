import { Component, Input, OnInit } from '@angular/core';
import { SolveLec } from 'src/app/main/main/table/utility/interface';

@Component({
  selector: 'app-lecture-options',
  templateUrl: './lecture-options.component.html',
  styleUrls: ['./lecture-options.component.css']
})
export class LectureOptionsComponent  {
  @Input() td: SolveLec|null = null;

  constructor() { }
  
  cut():void {
    
  }
  
  copy(): void{
    
  }
  
  paste(): void{
    
  }
  
  isPasteAvailable(): boolean{
    return false;
  }
}
