/// <reference lib="webworker" />

import { WeekDay } from "@angular/common";
import { SolveLec, StaticLec, Final, WEEK_DAYS } from "./static";
import { Table } from "./tableBinder";
var final = new Final();

onmessage = ({ data }) => {
  var params: [staticLecs: StaticLec[], solveLecs: SolveLec[], otherTables: Table[]] = JSON.parse(data);
  console.log(params);
  //worker should be used as external normal function that has parameters and return
  try {

    var ret = generateSchedule(...params);
    postMessage(JSON.stringify(ret));
  } catch (e) {
    console.error("Error: Worker > generateSchedule > catch > e = ", e)
    postMessage(JSON.stringify(null))
  }

  //return
}

interface Snapshot {
  solveLecs: SolveLec[];
  newLec?: SolveLec;
  i: {
    staticLec: number,
    day: number,
    startTime: number,
    duration: number,
  }
  stage: 'before' | 'after';
}

export function generateSchedule(staticLecs: readonly StaticLec[], solveLecsParam: SolveLec[], otherTables: Table[]): SolveLec[] | null {
  let durations = final.LECTURE_DURATIONS.reverse();
  let startTimes = final.START_TIMES;
  let weekDays = WEEK_DAYS;
  
  let retValue: SolveLec[] | null = null;
  let snapshots: Snapshot[] = [];
  let curSnap: Snapshot = { stage: 'before', solveLecs: solveLecsParam, i: { staticLec: 0, day: 0, startTime: 0, duration: 0 } };
  snapshots.push(curSnap);

  while (snapshots.length !== 0) {
    curSnap = snapshots.pop() as Snapshot;//snapshots won't be empty if it entered the while loop

    switch (curSnap.stage) {
      case 'before':

        let CONTINUE = false;
        for (; curSnap.i.staticLec < staticLecs.length;curSnap.i.staticLec++) {
          if (needTouch(staticLecs[curSnap.i.staticLec], curSnap.solveLecs)) {
            for (; curSnap.i.day < weekDays.length;curSnap.i.day++) {//'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
              for (; curSnap.i.startTime < startTimes.length; curSnap.i.startTime++) {//8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12
                for (; curSnap.i.duration < durations.length;curSnap.i.duration++) { //1 | 1.5 | 2 | 2.5 | 3

                  var newLec: SolveLec = { lecture: staticLecs[curSnap.i.staticLec], duration:durations[curSnap.i.duration], day:weekDays[curSnap.i.day], startTime:startTimes[curSnap.i.startTime] };
                  if (isPossible(curSnap.solveLecs, newLec, otherTables)) {
                    // pushOrExtendDuration(curSnap.solveLecs, newLec);//!solveLecs.push() how to backtrack if it extend the duration!!!!
                    curSnap.solveLecs.push(newLec);
                    //solve() recursive call
                    curSnap.newLec = newLec;
                    curSnap.stage = 'after';
                    snapshots.push(curSnap);
                    let newSnap: Snapshot = { stage: 'before', solveLecs: curSnap.solveLecs, i: { staticLec: 0, day: 0, startTime: 0, duration: 0 } }
                    snapshots.push(newSnap);
                    CONTINUE = true;
                    //
                  }
                  if (CONTINUE) break;
                }
                if (CONTINUE) break;
              }
              if (CONTINUE) break;
            }
            if (CONTINUE) break;
            retValue = null;//return null;
            CONTINUE = true;
          }
          if (CONTINUE) break;
        }
        if (CONTINUE) continue;
        retValue = curSnap.solveLecs;
        continue;
        break;
      case 'after':

        if (retValue == null) {
          if (curSnap.newLec) {
            curSnap.solveLecs.splice(curSnap.solveLecs.indexOf(curSnap.newLec), 1);
            curSnap.stage = 'before';
            curSnap.i.duration++;
            snapshots.push(curSnap);
          }
          else throw new Error('newLec is undefined! =' + curSnap.newLec)
        }
        else {
          retValue = curSnap.solveLecs;//return solveLecs;//!logically it should be return x; i.e only continue;
          continue;
        }

        break;
    }
  }
  return retValue;
}


/**
   * 
   * @param staticLecs that solveLecs will be generated base on
   * @param solveLecs pass constant lectures in the table or if table empty then pass empty arr
   * @param otherTables tables to avoid collision. NOTE: do not pass the table solveLecs will generated for. 
   * @returns 
   */
export function generateScheduleRecursive(staticLecs: readonly StaticLec[], solveLecs: SolveLec[], otherTables: readonly Table[]/*,config:ConfigGen*/): SolveLec[] | null {
  let lectureDurations = final.LECTURE_DURATIONS.reverse();
  for (let staticLec of staticLecs)
    if (needTouch(staticLec, solveLecs)) {
      for (let day of WEEK_DAYS)//'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
        for (let startTime of final.START_TIMES)//8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12
          for (let duration of lectureDurations) //1 | 1.5 | 2 | 2.5 | 3
          {
            var newLec: SolveLec = { lecture: staticLec, duration, day, startTime };
            if (isPossible(solveLecs, newLec, otherTables)) {
              pushOrExtendDuration(solveLecs, newLec);//solveLecs.push()
              let x = generateScheduleRecursive(staticLecs, solveLecs, otherTables);
              // stack.push(JSON.parse(JSON.stringify({ staticLecs, solveLecs, otherTables })));
              if (x === null)
                solveLecs.splice(solveLecs.indexOf(newLec), 1);
              else return solveLecs;
            }
          }
      return null;
    }
  return solveLecs;
}

export function pushOrExtendDuration(solveLecs: SolveLec[], newLec: SolveLec) {
  let exist = false;
  for (let s of solveLecs)
    if (s.day == newLec.day && equalLecInfoSTR(s.lecture, newLec.lecture)) {
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
export function isPossible(solveLecs: SolveLec[], n: SolveLec, tables: readonly Table[]): boolean {

  //TEST WEEK_DURATION1
  if (testWeekDuration(solveLecs, n) == false)
    return false;


  //TEST DURATION_COLLISION2
  if (testDurationCollision(solveLecs, n) == false)
    return false;



  //TEST WALL3
  if (testWall(n) == false)
    return false;

  //TEST DAY_DURATION4
  if (testDayDuration(solveLecs, n) == false)
    return false;


  //TEST TABLE_COLLISION5
  if (testTableCollision(n, tables) == false)
    return false;

  return true;
}

export function testWeekDuration(solveLecs: SolveLec[], n: SolveLec): boolean {
  // console.log('WEEK_DURATION1')
  if (getTotalHours([...solveLecs, n], n.lecture) > n.lecture.weekDuration)//solveLecs total dur in week is exceeds the staticLec weekDuration
    return false;
  return true;
}

export function testDurationCollision(solveLecs: SolveLec[], n: SolveLec): boolean {
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

export function testWall(n: SolveLec): boolean {
  if (final.START_TIME > n.startTime)//prevent lec before available duration __|
    return false;
  if (final.LAST_START_TIME - final.STEP_TIME < n.startTime)//prevent lec after available duration |__
    return false;
  if (n.startTime + n.duration > final.LAST_START_TIME + final.STEP_TIME)//prevent lec dur after available duration __|_
    return false;
  return true;
}

export function testDayDuration(solveLecs: SolveLec[], n: SolveLec): boolean {
  //prevent lec total dur in single day to exceeds MAX_LECTURE_DURATION
  if (solveLecs.filter(v => v.day == n.day && equalLecInfoSTR(v.lecture, n.lecture)).reduce((acc, v) => v.duration + acc, 0)
    + n.duration > final.MAX_LECTURE_DURATION)
    return false;
  return true;
}

export function testTableCollision(n: SolveLec, tables: readonly Table[]): boolean {
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

export function merge(s: SolveLec[]): SolveLec[] {
  let w = WEEK_DAYS;
  s = s.sort((a, b) => w.indexOf(a.day) > w.indexOf(b.day) ? 1 : -1)
    .sort((a, b) => a.startTime < b.startTime ? 1 : (a.startTime < b.startTime ? -1 : 0));

  let newSolveLecs: SolveLec[] = []
  for (let i = 0; i < s.length; i++)
    for (let j = i + 1; j < s.length; j++) {
      if (s[i].day == s[j].day && equalLecInfoSTR(s[i].lecture, s[j].lecture)
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
export function needTouch(sLec: StaticLec, solveLecs: SolveLec[]): Boolean {
  // console.log('needTouch')
  if (getTotalHours(solveLecs, sLec) < sLec.weekDuration)
    return true;
  else return false;
}

export function getTotalHours(solveLecs: SolveLec[], staticLec: StaticLec): number {
  var totalDur: number = 0;
  for (let lec of solveLecs) {
    if (equalLecInfoSTR(lec.lecture, staticLec)) {
      totalDur += Number(lec.duration);
    }
  }
  return totalDur;
}

/**
 * @returns (a.teacher == b.teacher && a.room == b.room && a.name == b.name)
 */
export function equalLecInfoSTR(a: StaticLec, b: StaticLec): boolean {
  return a.teacher == b.teacher && a.room == b.room && a.name == b.name;
}

