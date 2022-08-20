export type WeekDays = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';



export const WEEK_DAYS: WeekDays[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export interface StaticLec {
   name: string;
   teacher: string;
   room: string;
   /**
    * Lecture total hours in one week
    */
   weekDuration: number;
}

type Collision = 'Teacher' | 'Room';
export interface SolveLec {
   id?: string;
   lecture: StaticLec;
   day: WeekDays;
   duration: number;
   startTime: number;
   collision?: Collision[];
}


export interface Teacher {
   id?: number;
   name: string;
};
export interface Subject {
   id?: number;
   name: string;
};
export interface Room {
   id?: number;
   name: string;
}

export interface Row {
   day: WeekDays;
   tds: (SolveLec | null)[];
}

export interface ConfigGen{
   OrderBy: {
      /**
       * Array of 
       */
      WeekDays: WeekDays[];
   }
   
}
export class Final {
   constructor() { }
   readonly LECTURE_DURATIONS: number[] = [1, 1.5, 2, 2.5, 3];
   readonly START_TIME: number = 8;
   readonly START_TIMES: number[] = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5]//todo by start_time and end_time implement this
   readonly STEP_TIME: number = 0.5;
   readonly MAX_LECTURE_DURATION: number = this.LECTURE_DURATIONS.reduce((a: number, b: number) => a > b ? a : b);
   readonly MIN_LECTURE_DURATION: number = this.LECTURE_DURATIONS.reduce((a: number, b: number) => a < b ? a : b);
   readonly LAST_START_TIME: number = this.START_TIMES[this.START_TIMES.length - 1];
}
