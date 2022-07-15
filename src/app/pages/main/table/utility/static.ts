export type WeekDays = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
// export type LecAllowableDur = 1 | 1.5 | 2 | 2.5 | 3;

const END_TIME: number = 1;


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
   id: string;
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
export class Final {
   constructor() { }
   readonly LECTURE_HOURS: number[] = [1, 1.5, 2, 2.5, 3];
   readonly START_TIME: number = 8;
   readonly START_TIMES: number[] = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5]//todo by start_time and end_time implement this
   readonly MAX_LECTURE_HOUR: number = this.LECTURE_HOURS.reduce((a: number, b: number) => a > b ? a : b);
   readonly STEP_TIME: number = 0.5;
  
}

type EventName = 'tableLecturesChanged' | 'treeTeachersSubjectsRooms';
export class MyEventEmitter {//copy of EventEmitter class in NodeJS
   listeners: any = {};  // key-value pair

   on(eventName: EventName, fn: Function) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(fn);
      return this;
   }

   once(eventName: EventName, fn: Function) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      const onceWrapper = () => {
         fn();
         this.off(eventName, onceWrapper);
      }
      this.listeners[eventName].push(onceWrapper);
      return this;
   }

   off(eventName:EventName, fn:Function) {
      let lis = this.listeners[eventName];
      if (!lis) return this;
      for (let i = lis.length; i > 0; i--) {
         if (lis[i] === fn) {
            lis.splice(i, 1);
            break;
         }
      }
      return this;
   }


   emit(eventName: EventName, ...args: any) {
      console.log('emit called')
      let fns = this.listeners[eventName];
      if (!fns) return false;
      fns.forEach((f:Function) => {
         f(...args);
      });
      return true;
   }

   listenerCount(eventName:EventName) {
      let fns = this.listeners[eventName] || [];
      return fns.length;
   }

   rawListeners(eventName:EventName) {
      return this.listeners[eventName];
   }




   // on(eventName: EventName, fn: Function) {
   //    this.listeners[eventName] = this.listeners[eventName] || [];
   //    this.listeners[eventName].push(fn);
   //    return this;

   // }

   removeListener(eventName: EventName) {
      for (let key in this.listeners)
         if (key == eventName)
            this.listeners[eventName] = undefined;
   }


   // emit(eventName: EventName, ...args: any) {
   //    if (this.listeners[eventName])
   //       for (let l of this.listeners[eventName])
   //          l(...args);
   //    else throw new Error(`Event ${eventName} has no listener!`);
   //    return this;
   // }

}



