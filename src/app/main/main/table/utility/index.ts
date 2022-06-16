export type WeekDays = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
// export type LecAllowableDur = 1 | 1.5 | 2 | 2.5 | 3;
export const START_TIME: number = 8;
const END_TIME: number = 1;
export const STEP_TIME: number = 0.5;//this is not reliable to change
export const LECTURE_HOURS: number[] = [1, 1.5, 2, 2.5, 3];
export const WEEK_DAYS: WeekDays[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
export const MAX_LECTURE_HOUR = LECTURE_HOURS.reduce((a, b) => a > b ? a : b);
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








