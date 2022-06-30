import { HostListener, Injectable } from '@angular/core';
import { ControlLectureService } from './control-lecture.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  constructor(private dataService: DataService,private lecControl:ControlLectureService) {
    document.onkeydown = (event: any) => {

      var e = window.event ? window.event : event;
      if (e.keyCode == 90 && e.ctrlKey)
        this.dataService.undo();
      else if (e.keyCode == 89 && e.ctrlKey)
        this.dataService.redo();
      else if (e.keyCode == 86 && e.ctrlKey)
        this.lecControl.pasteFocus();
      else if (e.keyCode == 67 && e.ctrlKey)
        this.lecControl.copyFocus();
      else if (e.keyCode == 88 && e.ctrlKey)
        this.lecControl.cutFocus();
      else if (e.keyCode == 46)
        this.lecControl.deleteFocus();
      else if (e.keyCode == 77 && e.ctrlKey)
        this.lecControl.editFocus();
      // else
      //   console.log('KeyCoded', e.keyCode);



    }
  }



}
