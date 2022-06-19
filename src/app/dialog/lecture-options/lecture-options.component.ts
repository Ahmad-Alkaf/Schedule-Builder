import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Final, SolveLec } from 'src/app/main/main/table/utility/interface';

@Component({
  selector: 'app-lecture-options',
  templateUrl: './lecture-options.component.html',
  styleUrls: ['./lecture-options.component.css']
})
export class LectureOptionsComponent  {
  @Input() td: SolveLec|null = null;

  constructor(public final:Final,iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 
    iconRegistry.addSvgIconLiteral('copy', sanitizer.bypassSecurityTrustHtml(this.final.SVG_copy));

  }
  
  cut():void {
    
    // this.tableLecturesEvent.emit('tableLecturesChange');
  }
  
  copy(): void{
    
    // this.tableLecturesEvent.emit('tableLecturesChange');
  }
  
  paste(): void{
    
    // this.tableLecturesEvent.emit('tableLecturesChange');
  }
  
  isPasteAvailable(): boolean{
    return false;
  }
}
