import { Injectable, OnInit } from '@angular/core';
import { Final, SolveLec, StaticLec, WEEK_DAYS } from './static';
import { Table } from './tableBinder';

const final = new Final();
@Injectable({
  providedIn: 'root',

})
export class GenerateTableService implements OnInit {
  constructor() { }
  ngOnInit(): void {
    // const staticLecs: StaticLec[] = [
    //   { name: 'English', teacher: 'Abduallah', weekDuration: 3, room: '301' },
    //   { name: 'Server-Side', teacher: 'Hassan', weekDuration: 6, room: '302' },
    //   { name: 'PM', teacher: 'Hamza', weekDuration: 3, room: '401' },
    //   { name: 'HCI', teacher: 'Ahmed', weekDuration: 3, room: '402' },
    //   { name: 'Database', teacher: 'Mohammed', weekDuration: 6, room: 'Lab 3' },
    //   { name: 'Organization', teacher: 'Mohsen', weekDuration: 3, room: 'Lab 4' },
    // ];
    // console.log('generating')
    // // this.generateSchedule(staticLecs, []);
  }


  /**
   * 
   * @param staticLecs that solveLecs will be generated base on
   * @param solveLecs pass constant lectures in the table or if table empty then pass empty arr
   * @param otherTables tables to avoid collision. NOTE: do not pass the table solveLecs will generated for. 
   * @returns 
   */
  public generateSchedule = (staticLecs: StaticLec[], solveLecs: SolveLec[], otherTables: Table[]): Promise<SolveLec[]|undefined> => {
    return new Promise(async (resolve, reject) => {
      // const solve = (staticLecs: StaticLec[], solveLecs: SolveLec[]) => {
      for (let staticLec of staticLecs)
        if (this.needTouch(staticLec, solveLecs)) {
          for (let day of WEEK_DAYS)//'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
            for (let startTime of final.START_TIMES)//8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12
              for (let duration of final.LECTURE_DURATIONS) //1 | 1.5 | 2 | 2.5 | 3
              {
                var solvedLec: SolveLec = { lecture: staticLec, duration, day, startTime };
                // console.log(...solveLecs)
                if (this.isPossible(solveLecs, solvedLec)) {
                  let last = solveLecs[solveLecs.length - 1];
                  if (this.equalLecInfoSTR(last.lecture, solvedLec.lecture) && last.startTime + last.duration == solvedLec.startTime)
                    last.duration += solvedLec.duration;
                  else
                    solveLecs.push(solvedLec);
                  let x = await this.generateSchedule(staticLecs, solveLecs, otherTables);
                  if (x)
                    return resolve(solveLecs);
                  solveLecs.splice(solveLecs.indexOf(solvedLec), 1);
                }
              }
          return;
        }
      console.log('solution:', solveLecs);
      return resolve(solveLecs);
    })
  }


  /**
   * @param solveLecs existing SolveLec
   * @param n is solveLec with ordered random attr
   * @returns whether n is possible to join solveLecs as valid valid
   */
  public isPossible = (solveLecs: SolveLec[], n: SolveLec): boolean => {

    if (this.getTotalHours([...solveLecs, n], n.lecture) > n.lecture.weekDuration)//solveLecs total dur in week is exceeds the staticLec weekDuration
      return false;

    for (let lec of solveLecs)  //if at the same day and n.startTime between another lecture period(another.startTime to another.duration)
      if (lec.day == n.day) {
        if (lec.startTime <= n.startTime &&
          lec.startTime + lec.duration > n.startTime)
          return false;
        else if (n.startTime <= lec.startTime &&
          n.startTime + n.duration > lec.startTime)
          return false;
      }

    if (final.START_TIME > n.startTime)//prevent lec before available duration __|
      return false;
    if (final.LAST_START_TIME - final.STEP_TIME < n.startTime)//prevent lec after available duration |__
      return false;
    if (n.startTime + n.duration > final.LAST_START_TIME + final.STEP_TIME)//prevent lec dur after available duration __|_
      return false;

    for (let lec of solveLecs)//prevent lec total dur in single day to exceeds MAX_LECTURE_DURATION
      if (lec.day == n.day && this.equalLecInfoSTR(lec.lecture, n.lecture)) {
        if (lec.duration + n.duration > final.MAX_LECTURE_DURATION)
          return false;
      }

    // !if two lectures in same room with the same time return false
    // !if collision to another lecture in ANOTHER TABLE
    return true;
  }


  public merge = (lectures: SolveLec[]): SolveLec[] => {
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
      : (a.startTime > b.startTime ? 1 : -1))
  }


  /**
   * if all solveLecs doesn't apply the desire of staticLec then solveLecs have to be changed. ex: weekDuration for staticLec B is 6 hours but total B of solveLecs are 5 hours then staticLec needTouch on solveLecs
   * @param sLec 
   * @param lectures 
   * @returns 
   */
  public needTouch = (sLec: StaticLec, lectures: SolveLec[]): Boolean => {

    if (this.getTotalHours(lectures, sLec) < sLec.weekDuration)
      return true;
    else return false;
  }

  public getTotalHours = (lectures: SolveLec[], staticLec: StaticLec): number => {
    var totalDur: number = 0;
    for (let lec of lectures) {
      if (this.equalLecInfoSTR(lec.lecture, staticLec)) {
        totalDur += Number(lec.duration);
      }
    }
    return totalDur;
  }

  /**
   * @returns (a.teacher == b.teacher && a.room == b.room && a.name == b.name)
   */
  equalLecInfoSTR(a: StaticLec, b: StaticLec): boolean {
    return a.teacher == b.teacher && a.room == b.room && a.name == b.name;
  }

}
