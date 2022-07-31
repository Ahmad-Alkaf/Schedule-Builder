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
  public generateSchedule = (staticLecs: StaticLec[], solveLecs: SolveLec[], otherTables: Table[]/*,config:ConfigGen*/): SolveLec[] | null => {
    let lectureDurations = final.LECTURE_DURATIONS.reverse();

    // let stack: { staticLecs: StaticLec[], solveLecs: SolveLec[], otherTables: Table[] }[] = [];
    // stack.push({ staticLecs: staticLecsMain, solveLecs: solveLecsMain, otherTables: otherTablesMain });
    // while (stack.length) {
    //   let { staticLecs, solveLecs, otherTables } = stack.pop() as { staticLecs: StaticLec[], solveLecs: SolveLec[], otherTables: Table[] };//because while(stack.length)
      for (let staticLec of staticLecs)
        if (this.needTouch(staticLec, solveLecs)) {
          for (let day of WEEK_DAYS)//'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
            for (let startTime of final.START_TIMES)//8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12
              for (let duration of lectureDurations) //1 | 1.5 | 2 | 2.5 | 3
              {
                var newLec: SolveLec = { lecture: staticLec, duration, day, startTime };
                if (this.isPossible(solveLecs, newLec, otherTables)) {
                  this.pushOrExtendDuration(solveLecs, newLec);//solveLecs.push()
                  let x = this.generateSchedule(staticLecs, solveLecs, otherTables);
                  // stack.push(JSON.parse(JSON.stringify({ staticLecs, solveLecs, otherTables })));
                  if (x === null)
                    solveLecs.splice(solveLecs.indexOf(newLec), 1);
                  else return solveLecs;
                }
              }
          return null;
          // break;
        }
      return solveLecs;
    // }
    // console.log({ stack })
    // return stack[0].solveLecs;
  }

  private pushOrExtendDuration(solveLecs: SolveLec[], newLec: SolveLec) {
    let exist = false;
    for (let s of solveLecs)
      if (s.day == newLec.day && this.equalLecInfoSTR(s.lecture, newLec.lecture)) {
        if (s.startTime + s.duration == newLec.startTime) {
          s.duration += newLec.duration; exist = true; break;
        } else if (newLec.startTime + newLec.duration == s.startTime) {
          s.startTime -= newLec.duration; exist = true; break;
        }

      }
    if (exist == false)
      solveLecs.push(newLec);
  }

  /**
   * @param solveLecs existing SolveLec
   * @param n is solveLec with ordered random attr
   * @returns whether n is possible to join solveLecs as valid valid
   */
  public isPossible = (solveLecs: SolveLec[], n: SolveLec, tables: Table[]): boolean => {

    //TEST WEEK_DURATION1
    if (this.testWeekDuration(solveLecs, n) == false)
      return false;


    //TEST DURATION_COLLISION2
    if (this.testDurationCollision(solveLecs, n) == false)
      return false;



    //TEST WALL3
    if (this.testWall(n) == false)
      return false;

    //TEST DAY_DURATION4
    if (this.testDayDuration(solveLecs, n) == false)
      return false;


    //TEST TABLE_COLLISION5
    if (this.testTableCollision(n, tables) == false)
      return false;

    return true;
  }

  private testWeekDuration(solveLecs: SolveLec[], n: SolveLec): boolean {
    // console.log('WEEK_DURATION1')
    if (this.getTotalHours([...solveLecs, n], n.lecture) > n.lecture.weekDuration)//solveLecs total dur in week is exceeds the staticLec weekDuration
      return false;
    return true;
  }

  private testDurationCollision(solveLecs: SolveLec[], n: SolveLec): boolean {
    for (let lec of solveLecs)  //if at the same day and n.startTime between another lecture period(another.startTime to another.duration)
      if (lec.day == n.day) {
        if (lec.startTime <= n.startTime &&
          lec.startTime + lec.duration > n.startTime)
          return false;
        else if (n.startTime <= lec.startTime &&
          n.startTime + n.duration > lec.startTime)
          return false;
      }
    return true;
  }

  private testWall(n: SolveLec): boolean {
    if (final.START_TIME > n.startTime)//prevent lec before available duration __|
      return false;
    if (final.LAST_START_TIME - final.STEP_TIME < n.startTime)//prevent lec after available duration |__
      return false;
    if (n.startTime + n.duration > final.LAST_START_TIME + final.STEP_TIME)//prevent lec dur after available duration __|_
      return false;
    return true;
  }

  private testDayDuration(solveLecs: SolveLec[], n: SolveLec): boolean {
    //prevent lec total dur in single day to exceeds MAX_LECTURE_DURATION
    if (solveLecs.filter(v => v.day == n.day && this.equalLecInfoSTR(v.lecture, n.lecture)).reduce((acc, v) => v.duration + acc, 0)
      + n.duration > final.MAX_LECTURE_DURATION)
      return false;
    return true;
  }

  private testTableCollision(n: SolveLec, tables: Table[]): boolean {
    for (let table of tables)
      for (let lec of table.lectures)
        if (lec.day == n.day) {
          if (n.startTime >= lec.startTime
            && lec.startTime + lec.duration > n.startTime
            && (lec.lecture.room == n.lecture.room || lec.lecture.teacher == n.lecture.teacher))
            return false;

          else if (lec.startTime >= n.startTime
            && n.startTime + n.duration > lec.startTime
            && (lec.lecture.room == n.lecture.room || lec.lecture.teacher == n.lecture.teacher))
            return false;
        }
    return true;
  }

  private merge = (s: SolveLec[]): SolveLec[] => {
    let w = WEEK_DAYS;
    s = s.sort((a, b) => w.indexOf(a.day) > w.indexOf(b.day) ? 1 : -1)
      .sort((a, b) => a.startTime < b.startTime ? 1 : (a.startTime < b.startTime ? -1 : 0));

    let newSolveLecs: SolveLec[] = []
    for (let i = 0; i < s.length; i++)
      for (let j = i + 1; j < s.length; j++) {
        if (s[i].day == s[j].day && this.equalLecInfoSTR(s[i].lecture, s[j].lecture)
          && s[i].startTime + s[i].duration == s[j].startTime) {
          s[i].duration += s[j].duration;
          s.splice(s.indexOf(s[j]), 1);
          newSolveLecs.push(s[i]);
        } else {
          if (!newSolveLecs.includes(s[i]))
            newSolveLecs.push(s[i]);
        }
      }

    return newSolveLecs;
  }


  /**
   * if the total duration of all solveLecs met their staticLec week duration, then return false. Other wise return true because solveLec have to be changed. ex: weekDuration for staticLec B is 6 hours but total B of solveLecs are 5 hours then staticLec needTouch on solveLecs
   * @param sLec 
   * @param solveLecs 
   * @returns 
   */
  public needTouch = (sLec: StaticLec, solveLecs: SolveLec[]): Boolean => {
    // console.log('needTouch')
    if (this.getTotalHours(solveLecs, sLec) < sLec.weekDuration)
      return true;
    else return false;
  }

  public getTotalHours = (solveLecs: SolveLec[], staticLec: StaticLec): number => {
    var totalDur: number = 0;
    for (let lec of solveLecs) {
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
