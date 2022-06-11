export type WeekDays = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
// export type LecAllowableDur = 1 | 1.5 | 2 | 2.5 | 3;
export const START_TIME: number = 8;
const END_TIME: number = 1;
export const STEP_TIME: number = 0.5;//this is not reliable to change
const LECTURE_HOURS: number[] = [1, 1.5, 2, 2.5, 3];
export const WEEK_DAYS: WeekDays[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const MAX_LECTURE_HOUR = LECTURE_HOURS.reduce((a, b) => a > b ? a : b);
// export type StartTime = 8 | 8.5 | 9 | 9.5 | 10 | 10.5 | 11 | 11.5 | 12|12.5;
export const START_TIMES: number[] = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12,12.5]//todo by start_time and end_time implement this
export interface StaticLec {
   name: string;
   teacher: string;
   room: string;
   /**
    * Lecture total hours in one week
    */
   weekDuration: number;
}

export interface SolveLec {
   id: string;
   lecture: StaticLec;
   day: WeekDays;
   duration: number;
   startTime: number;
}

export const staticLecs: StaticLec[] = [
   { name: 'English', teacher: 'Abduallah', weekDuration: 3,room:'301' },
   { name: 'Server-Side', teacher: 'Hassan', weekDuration: 6,room:'302' },
   { name: 'PM', teacher: 'Hamza', weekDuration: 3,room:'401' },
   { name: 'HCI', teacher: 'Ahmed', weekDuration: 3,room:'402' },
   { name: 'Database', teacher: 'Mohammed', weekDuration: 6,room:'Lab 3' },
   { name: 'Organization', teacher: 'Mohsen', weekDuration: 3,room:'Lab 4' },
]

export function generateSchedule(staticLecs: StaticLec[], lectures: SolveLec[]): Promise<SolveLec[]> {
   return new Promise(async (resolve, reject) => {
      const solve = (staticLecs: StaticLec[], lectures: SolveLec[]) => {
         for (let s of staticLecs)
            if (needTouch(s, lectures)) {
               for (let day of WEEK_DAYS)//'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
                  for (let st of START_TIMES)//8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12
                     for (let lecHour of LECTURE_HOURS) //1 | 1.5 | 2 | 2.5 | 3
                     {
                        var n: SolveLec = { id:Math.random().toString(36).substring(2),lecture: s, duration: lecHour, day, startTime: st };
                        if (isPossible(lectures, n)) {
                           lectures.push(n);
                           solve(staticLecs, lectures);
                           lectures.pop();
                        }
                     }
               return;
            }
         console.log(lectures)
         // throw lectures;
      }


      // try { //!BAD practice make another way for catch the solution
         solve(staticLecs, lectures);
// reject('Could Not Generate A Table')
//       } catch (lecs) {

//          return resolve(merge(lecs));
//       }
   })
}

function needTouch(sLec: StaticLec, lectures: SolveLec[]): Boolean {

   if (getTotalHours(lectures, sLec) < sLec.weekDuration)
      return true;
   else return false;
}
// console.log(isPossible(lectures, []))//[{ weekDay: 'Saturday', lectures: [{ name: 'PM', duration: 1, teacher: 'Hamza', weekDuration: 3 }, { name: 'PM', duration: 1, teacher: 'Hamza', weekDuration: 3 }] },{weekDay:'Thursday',lectures:[{ name: 'PM', duration: 1, teacher: 'Hamza', weekDuration: 3 }]}]));

function isPossible(lectures: SolveLec[], n: SolveLec): Boolean {

   if (getTotalHours([...lectures, n], n.lecture) > n.lecture.weekDuration)//if total hours of a lecture in week is more than the decided staticLecture.weekDuration
      return false;

   let isLecsAlign = false;
   for (let lec of lectures)  //if at the same day and n.startTime between another lecture period(another.startTime to another.duration)
      if (lec.day == n.day) {
         if (lec.startTime <= n.startTime &&
            lec.startTime + lec.duration > n.startTime)
            return false;
         if (n.startTime == START_TIME || lec.startTime + lec.duration == n.startTime)
            isLecsAlign = true;
      }
   if (isLecsAlign == false)
      return false;



   for (let day of WEEK_DAYS) {//if two three.. lecture after another with sum duration more than 3 hours(max value of LectureHours) return false;
      let total = 0
      for (let lec of lectures)
         if (lec.day == day && lec.lecture.name == n.lecture.name && lec.lecture.teacher == n.lecture.teacher) {
            total += lec.duration;
         }
      if (total + n.duration > MAX_LECTURE_HOUR)
         return false;
   }

//!if lecture pass the END_TIME. ex: one lec start at 12 O'clock and its dur is 3h and END_TIME=1 O'clock then lec will end at 3 O'clock !!! then return false;
//!if two lectures in same room with the same time return false
   return true;
}


function getTotalHours(lectures: SolveLec[], staticLec: StaticLec): number {
   var totalDur: number = 0;
   for (let lec of lectures) {
      if (lec.lecture.name == staticLec.name && lec.lecture.teacher == staticLec.teacher) {
         totalDur += lec.duration;
      }
   }
   return totalDur;
}

function merge(lectures: SolveLec[]): SolveLec[] {
   var ed: SolveLec[] | null = [...lectures];

   for (let i = 0; i < ed.length; i++)
      for (let j = i + 1; j < ed.length; j++)
         if (ed[i]?.lecture.name == ed[j].lecture.name)
            if (ed[i].lecture.teacher == ed[j].lecture.teacher)
               if (ed[i].day == ed[j].day)
                  if (ed[i].startTime + ed[i].duration == ed[j].startTime) {
                     ed[j].startTime -= ed[i].duration;
                     ed[j].duration += ed[i].duration;
                     delete ed[i]
                  }
                  else if (ed[j].startTime + ed[j].duration == ed[i].startTime) {
                     ed[j].duration += ed[i].duration;
                     delete ed[i];
                  }


   ed = ed.filter((v) => v);
   return ed.sort((a, b) => a.day != b.day ?
      (WEEK_DAYS.indexOf(a.day) > WEEK_DAYS.indexOf(b.day) ?
         1 :
         (WEEK_DAYS.indexOf(b.day) > WEEK_DAYS.indexOf(a.day) ? -1 : 0))
      :(a.startTime > b.startTime?1:-1))
}