import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditLectureComponent } from '../dialog/edit-lecture/edit-lecture.component';
import { Final, Row, SolveLec, WeekDays } from 'src/app/services/static';
import { DataService } from './data.service';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class ControlLectureService {

  private clipboard: SolveLec | undefined = undefined
  public focused: SolveLec | { index: number, day: WeekDays } | undefined = undefined;

  constructor(private ds:DataService,private sound:SoundService,private dialog:MatDialog,private final:Final, private snackbar:MatSnackBar) { }
    /**
     * edit the focused lecture if null play 'notification' sound
     */
     public editFocus(): void {//todo keyboard shortcut
      if (!this.focused || 'index' in this.focused)
        this.sound.play('notification')
      else this.edit(this.focused)
    }
  
    /**
     * 
     * @param lecture lecture to be edit
     * pop up dialog with copy of edited lecture and if submit then result form will be assigned at edited lecture
     */
    public edit(lecture: SolveLec): void {
      const ref = this.dialog.open(EditLectureComponent, {
        width: '800px',
        data: JSON.parse(JSON.stringify(lecture))//copy
      });
  
      ref.afterClosed().subscribe(result => {
        if (!result) return;//cancel dialog
        let table = this.ds.getTableOf(lecture);
        if (table == 'container')
          this.ds.newLecContainer.splice(this.ds.newLecContainer.indexOf(lecture), 1, result);
        else {
          let lecs = [...table.lectures];
          lecs.splice(table.lectures.indexOf(lecture), 1, result);
          table.lectures = lecs;
        }
        this.ds.saveState()
      });
    }
    /**
       * delete the focused lecture if null play 'notification' sound
       */
    public deleteFocus() {
      if (!this.focused || 'index' in this.focused)
        this.sound.play('notification')
      else { this.delete(this.focused); this.focused = undefined; }
    }
    public delete(lecture: SolveLec): void {
      let table = this.ds.getTableOf(lecture);
      if (table == 'container') {
        this.ds.newLecContainer.splice(this.ds.newLecContainer.indexOf(lecture), 1);
      } else {
        let lecs = [...table.lectures];
        lecs.splice(table.lectures.indexOf(lecture), 1);
        table.lectures = lecs;
      }
      this.ds.saveState();
      
      this.snackbar.open('Lecture Deleted!', 'Undo',{duration:4000}).onAction().subscribe(() => {
        if (table == 'container') {
          this.ds.newLecContainer.push(lecture);
        } else {
          let lecs = [...table.lectures];
          lecs.push(lecture);
          table.lectures = lecs;
        }
        this.ds.saveState();
      })
    }
    
    /**
     * copy the focused lecture if null play 'notification' sound
     */
    public copyFocus() {
      if (!this.focused || 'index' in this.focused)
        this.sound.play('notification');
      else
        this.copy(this.focused)
    }
  
    public copy(lecture: SolveLec) {
      console.log('copy', lecture)
      this.clipboard = JSON.parse(JSON.stringify(lecture));
      this.snackbar.open('Lecture Copied',undefined,{duration:2000})
    }
  
    /**
    * cut the focused lecture if null play 'notification' sound
    */
    public cutFocus() {
      if (!this.focused || 'index' in this.focused) //typeof {{ index: number, day: WeekDays }
        this.sound.play('notification');
      else
        this.cut(this.focused);
    }
  
    /**
     * 
     * @param lecture lecture to be cut
     */
    public cut(lecture: SolveLec) {
      console.log('cut', lecture)
      this.clipboard = JSON.parse(JSON.stringify(lecture));
      this.delete(lecture);
      this.snackbar.open('Lecture Cutted',undefined,{duration:2000})
    }
  
    /**
    * paste on the focused td if td=lecture play 'notification' sound
    */
    public pasteFocus() {
      if (this.focused && 'index' in this.focused)
        this.paste(this.focused);
      else this.sound.play('notification');
    }
  
    /**
     * @param pos is object that have index of tds and day to know where to paste
     */
    public paste(pos: { index: number, day: WeekDays }): void {
      if (!this.clipboard) {//empty clipboard
        this.snackbar.open('Clipboard is Empty!',undefined,{duration:2000})
        return this.sound.play('notification');
      }
      let lecture: SolveLec = JSON.parse(JSON.stringify(this.clipboard));//
  
      if (lecture && this.isAvailableSpace(pos.day, pos.index, lecture.duration)) {
        lecture.day = pos.day;
        lecture.startTime = this.getStartTime(pos.day, pos.index);
        if (lecture.startTime == -1)
          console.error('paste index is in critical position. come here');
        let table = this.ds.getActiveTable();
        table.lectures = [...table.lectures, lecture];
        this.ds.saveState();
      } else {
        this.sound.play('notification');
        this.snackbar.open('No Enough Space!',undefined,{duration:2000})

      }
    }
  
  /*********************************** PRIVATE *********************************************/
    /**
   * 
   * @pram index for position in row
   * @returns boolean whether a lecture can be place in that day, index with its duration
   */
     private isAvailableSpace(day: WeekDays, index: number, duration: number): boolean {
      const row: Row = this.ds.getActiveTable().rows.filter(v => v.day == day)[0];
      for (let i = index; i < index + duration * 2; i++) {
        if (row.tds.length <= i || row.tds[i] != null)
          return false;
      }
      return true;
     }
  
  /**
   * 
   * @param index of lecture in row.tds where row.day = @param day
   * @returns startTime of that index. -1 if not found
   */
   private getStartTime(day: WeekDays, index: number): number {
    const row: Row = this.ds.getActiveTable().rows.filter(v => v.day == day)[0];
    let st = this.final.START_TIME;
    for (let i = 0; i < row.tds.length; i++) {
      if (index == i)
        return st;
      let td = row.tds[i];
      if (td && 'duration' in td)
        st += td.duration;
      else
        st += this.final.STEP_TIME
    }
    return -1;
  }
}
