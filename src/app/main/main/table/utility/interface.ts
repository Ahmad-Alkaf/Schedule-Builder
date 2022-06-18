export type WeekDays = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
// export type LecAllowableDur = 1 | 1.5 | 2 | 2.5 | 3;

const END_TIME: number = 1;
export const STEP_TIME: number = 0.5;//this is not reliable to change

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

export interface SolveLec {
   id: string;
   lecture: StaticLec;
   day: WeekDays;
   duration: number;
   startTime: number;
}


export interface Teacher {
   name: string;
};
export interface Lesson {
   name: string;
};
export interface Room {
   name: string;
}

export class Final {
   constructor() { }
   readonly LECTURE_HOURS: number[] = [1, 1.5, 2, 2.5, 3];
   readonly START_TIME: number = 8;
   readonly START_TIMES: number[] = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5]//todo by start_time and end_time implement this
   readonly MAX_LECTURE_HOUR: number = this.LECTURE_HOURS.reduce((a: number, b: number) => a > b ? a : b);
   readonly SVG_moveable:string = `<svg width="24px" fill="currentColor" viewBox="0 0 24 24">
   <path
      d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z">
   </path>
   <path d="M0 0h24v24H0z" fill="none"></path>
</svg>`
}



