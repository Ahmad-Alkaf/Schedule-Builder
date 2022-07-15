import { Component, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Final, SolveLec } from 'src/app/pages/main/table/utility/static';
import { SoundService } from 'src/app/services/sound.service';
import { ControlLectureService } from 'src/app/services/control-lecture.service';

@Component({
  selector: 'app-lecture-options',
  templateUrl: './lecture-options.component.html',
  styleUrls: ['./lecture-options.component.css']
})
export class LectureOptionsComponent {
  @Input() td: SolveLec | null = null;

  constructor(public final: Final, public dataService: DataService,private sound:SoundService,private lecControl:ControlLectureService) {
  }
  edit(): void {
    this.td ? this.lecControl.edit(this.td) : this.sound.play('notification');
  }

  delete(): void {
    if(this.td)
      this.lecControl.delete(this.td);
    else this.sound.play('notification')
  }

  copy() {
    this.td ? this.lecControl.copy(this.td) : this.sound.play('notification'); 
  }
  
  cut() {
    this.td ? this.lecControl.cut(this.td) : this.sound.play('notification');
  }
  
  
  
  isPasteAvailable(): boolean {
    return false;
  }
  
}
