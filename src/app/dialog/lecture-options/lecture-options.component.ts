import { Component, Input } from '@angular/core';
import { DataService } from '@service/data.service';
import { Final, SolveLec } from '@service/static';
import { SoundService } from '@service/sound.service';
import { ControlLectureService } from '@service/control-lecture.service';

@Component({
  selector: 'app-lecture-options',
  templateUrl: './lecture-options.component.html',
  styleUrls: ['./lecture-options.component.scss']
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
