import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/data.service';
import { Final, SolveLec } from 'src/app/main/main/table/utility/interface';

@Component({
  selector: 'app-lecture-options',
  templateUrl: './lecture-options.component.html',
  styleUrls: ['./lecture-options.component.css']
})
export class LectureOptionsComponent  {
  @Input() td: SolveLec|null = null;
  @Input() isTable: boolean = false;

  constructor(public final:Final,private dataService:DataService,iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 
    iconRegistry.addSvgIconLiteral('copy', sanitizer.bypassSecurityTrustHtml(this.final.SVG_copy));

  }
  //!if you change tableLectures don't forget to emit
  edit(): void{
    // this.tableLecturesEvent.emit('tableLecturesChange');
    //this.dataService.saveState();
  }
  
  delete(): void{
    let error = new Error(`unexpected token! How null lecture i.e(in table as empty(off)) called me!!!!`);
    if (this.isTable === true) {
      if (this.td == null)
        throw error;
      this.dataService.tableLectures.splice(this.dataService.tableLectures.indexOf(this.td), 1);
      this.dataService.tableLecturesEvent.emit('tableLecturesChanged');
    } else {
      if (this.td == null)
        throw error;
      this.dataService.newLecContainer.splice(this.dataService.newLecContainer.indexOf(this.td), 1);
    }
    this.dataService.saveState();
  }
  
  cut():void {
    
    // this.tableLecturesEvent.emit('tableLecturesChange');
    //this.dataService.saveState();
  }
  
  copy(): void{
    
    // this.tableLecturesEvent.emit('tableLecturesChange');
    //this.dataService.saveState();
  }
  
  paste(): void{
    
    // this.tableLecturesEvent.emit('tableLecturesChange');
    //this.dataService.saveState();
  }
  
  isPasteAvailable(): boolean{
    return false;
  }
  
}
