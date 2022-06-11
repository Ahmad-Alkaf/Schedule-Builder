import { WeekDays, SolveLec, WEEK_DAYS, START_TIMES, STEP_TIME } from './index';
interface Row {
   day: WeekDays;
   tds: (SolveLec|null)[];
}

var todoDelete = {id:Math.random().toString(36).substring(2), day: WEEK_DAYS[0], duration: 0, startTime: 0, lecture: { name: 'oidv&*^', weekDuration: 0, teacher: '', room: '' } };
export const table: { _rows:Row[], rows: Row[], lecs: SolveLec[]; } = {
   _rows: [],
   get rows() {
      return this._rows;
   },
   set rows(rows:Row[]) {
      this._rows = rows;
      console.log('rows changed')
   },
   set lecs(ls: SolveLec[]) {
      this.rows = [];
      for (let w of WEEK_DAYS)//add empty rows and its <td>s
         this.rows.push({ day: w, tds: Array(START_TIMES.length).fill(null) });
      for (let l of ls)//bind lectures with type SolveLec[] to row[]
         for (let r of this.rows)
            if (l.day == r.day) {
               r.tds[START_TIMES.indexOf(l.startTime)] = l;
               //delete empty td to make lecture longer then STEP_TIME take more than one column i.e long width
               for (let i = l.startTime + STEP_TIME; i < l.startTime + l.duration; i += STEP_TIME)
                  r.tds[START_TIMES.indexOf(i)] = todoDelete;
            }
      for (let r of this.rows)
         r.tds = r.tds.filter((v) => v != todoDelete)
      }
}