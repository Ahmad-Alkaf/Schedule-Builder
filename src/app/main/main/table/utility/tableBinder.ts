import { WeekDays, SolveLec, WEEK_DAYS, STEP_TIME, Row } from './interface';
import { Final } from './interface';
const final = new Final();


var todoDelete = { id: Math.random().toString(36).substring(2), day: WEEK_DAYS[0], duration: 0, startTime: 0, lecture: { name: 'oidv&*^', weekDuration: 0, teacher: '', room: '' } };


export class TableBinder {

   
   lecsToRows(lecs: SolveLec[]): Row[] {
      let rows: Row[] = [];
      for (let w of WEEK_DAYS)//add empty rows and its <td>s
         rows.push({ day: w, tds: Array(final.START_TIMES.length).fill(null) });
      for (let l of lecs)//bind lectures with type SolveLec[] to row[]
         for (let r of rows)
            if (l.day == r.day) {
               r.tds[final.START_TIMES.indexOf(l.startTime)] = l;
               //delete empty td to make lecture longer then STEP_TIME take more than one column i.e long width
               for (let i = l.startTime + STEP_TIME; i < l.startTime + l.duration; i += STEP_TIME)
                  r.tds[final.START_TIMES.indexOf(i)] = todoDelete;
            }
      for (let r of rows)
         r.tds = r.tds.filter((v) => v != todoDelete);
      // console.log('lectures',lecs)
      // console.log('rows',rows)
      return rows
   }
}