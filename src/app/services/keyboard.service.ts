import { HostListener, Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  constructor(private dataService: DataService) {
    document.onkeydown = (event: any) => {

      var e = window.event ? window.event : event;
      if (e.keyCode == 90 && e.ctrlKey)
        this.dataService.undo();
      else if (e.keyCode == 89 && e.ctrlKey)
        this.dataService.redo();
      else if (e.keyCode == 86 && e.ctrlKey)
        this.dataService.pasteFocus()
      else if (e.keyCode == 67 && e.ctrlKey)
        this.dataService.copyFocus()
      else if (e.keyCode == 88 && e.ctrlKey)
        this.dataService.cutFocus()
      else if (e.keyCode == 46)
        this.dataService.deleteFocus()
      // else
      //   console.log('KeyCoded', e.keyCode);



    }
  }



}
