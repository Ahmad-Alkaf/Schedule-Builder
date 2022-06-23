import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/services/data.service';
import { Final, SolveLec } from 'src/app/main/main/table/utility/static';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-lecture-options',
  templateUrl: './lecture-options.component.html',
  styleUrls: ['./lecture-options.component.css']
})
export class LectureOptionsComponent {
  @Input() td: SolveLec | null = null;
  @Input() isTable: boolean = false;

  constructor(public final: Final, public dataService: DataService,private sound:SoundService) {
  }
  edit(): void {
    this.td ? this.dataService.edit(this.td) : this.sound.play('notification');
  }

  delete(): void {
    if(this.td)
      this.dataService.delete(this.td);
    else this.sound.play('notification')
  }

  copy() {
    this.td ? this.dataService.copy(this.td) : this.sound.play('notification'); 
  }
  
  cut() {
    this.td ? this.dataService.cut(this.td) : this.sound.play('notification');
  }
  
  
  
  isPasteAvailable(): boolean {
    return false;
  }
  
}
