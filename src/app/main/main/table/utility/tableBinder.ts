import { WeekDays, SolveLec, WEEK_DAYS, Row } from './static';
import { Final } from './static';
const final = new Final();


var todoDelete = { id: Math.random().toString(36).substring(2), day: WEEK_DAYS[0], duration: 0, startTime: 0, lecture: { name: 'oidv&*^', weekDuration: 0, teacher: '', room: '' } };


export class Table {
   private _lectures: SolveLec[] = [];
   
   private _rows:Row[] = this.lecturesToRows()
   constructor(public index: number, public name: string) {
   }

   public get lectures():readonly SolveLec[] {
      return Object.freeze(this._lectures);//prevent modification e.g push splice. to insure calling set.
   }
   public set lectures(lecs:readonly SolveLec[]) {
      this._lectures = [...lecs];
      this._rows = this.lecturesToRows();
   }

   public get rows() {
      return this._rows;//todo object.freeze if didn't works like that
   }


   private lecturesToRows(): Row[] {
      let rows: Row[] = [];
      for (let w of WEEK_DAYS)//add empty rows and its <td>s
         rows.push({ day: w, tds: Array(final.START_TIMES.length).fill(null) });
      for (let l of this._lectures)//bind lectures with type SolveLec[] to row[]
         for (let r of rows)
            if (l.day == r.day) {
               r.tds[final.START_TIMES.indexOf(l.startTime)] = l;
               //delete empty td to make lecture longer then STEP_TIME take more than one column i.e long width
               for (let i = l.startTime + final.STEP_TIME; i < l.startTime + l.duration; i += final.STEP_TIME)
                  r.tds[final.START_TIMES.indexOf(i)] = todoDelete;
            }
      for (let r of rows)
         r.tds = r.tds.filter((v) => v != todoDelete);
      // console.log('lectures',lecs)
      // console.log('rows',rows)
      return rows
   }
}


let table = new Table(0, 'CIS');
