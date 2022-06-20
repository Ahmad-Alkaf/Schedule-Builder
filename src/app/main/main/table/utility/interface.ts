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

export interface Row {
   day: WeekDays;
   tds: (SolveLec | null)[];
}
export class Final {
   constructor() { }
   readonly LECTURE_HOURS: number[] = [1, 1.5, 2, 2.5, 3];
   readonly START_TIME: number = 8;
   readonly START_TIMES: number[] = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5]//todo by start_time and end_time implement this
   readonly MAX_LECTURE_HOUR: number = this.LECTURE_HOURS.reduce((a: number, b: number) => a > b ? a : b);
   readonly SVG_moveable: string = `<svg width="24px" fill="currentColor" viewBox="0 0 24 24">
   <path
      d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z">
   </path>
   <path d="M0 0h24v24H0z" fill="none"></path>
</svg>`
   readonly SVG_copy: string = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21,8.94a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19.32.32,0,0,0-.09,0A.88.88,0,0,0,14.05,2H10A3,3,0,0,0,7,5V6H6A3,3,0,0,0,3,9V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V18h1a3,3,0,0,0,3-3V9S21,9,21,8.94ZM15,5.41,17.59,8H16a1,1,0,0,1-1-1ZM15,19a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V9A1,1,0,0,1,6,8H7v7a3,3,0,0,0,3,3h5Zm4-4a1,1,0,0,1-1,1H10a1,1,0,0,1-1-1V5a1,1,0,0,1,1-1h3V7a3,3,0,0,0,3,3h3Z"/></svg>`
}

type EventName = 'tableLecturesChanged';
export class MyEventEmitter {
   listeners:any = {};  // key-value pair
 
   on(eventName: EventName, fn: Function) {
       this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(fn);
      return this;
     
    }

   removeListener(eventName: EventName) {
      for (let key in this.listeners)
         if (key == eventName)
            this.listeners[eventName] = undefined;
    }


   emit(eventName: EventName, ...args: any) {
      if (this.listeners[eventName])
         for (let l of this.listeners[eventName])
            l(...args);
      else throw new Error(`Event ${eventName} has no listener!`);
      return this;
    }
}



