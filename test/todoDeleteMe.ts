//! https://www.codeproject.com/Articles/418776/How-to-replace-recursive-functions-using-stack-and
const SIZE = 3;
console.time('time')
console.log(solveRecUnstop([]))
console.timeEnd('time')
// first rule
interface Snapshot {
   arr: number[];
   i: number, num: number;
   stage: 'before' | 'after';
}

function solveLoop(arrParam: number[]): number[] | null {
   //second rule
   let retValue: number[] | null = null;

   //third rule
   let snapshots: Snapshot[] = [];

   //fourth rule
   let curSnap: Snapshot = { stage: 'before', arr: arrParam, i: 0, num: 0 };
   snapshots.push(curSnap);

   //fifth rule
   while (snapshots.length !== 0) {
      curSnap = snapshots.pop() as Snapshot;//snapshots won't be empty if it entered the while loop
      console.log(curSnap);
      // console.log(curSnap)
      //sixth rule
      switch (curSnap.stage) {
         case 'before'://code before recursive function call its self
            let CONTINUE = false;
            for (; curSnap.i < SIZE; curSnap.i++) {//i is index
               if (needTouch(curSnap.arr, curSnap.arr[curSnap.i])) {
                  for (; curSnap.num < SIZE; curSnap.num++) {//num is value
                     if (isPossible(curSnap.arr, curSnap.num)) {
                        curSnap.arr.push(curSnap.num);
                        //solve() recursive call
                        curSnap.stage = 'after';
                        snapshots.push(curSnap);
                        let newSnap: Snapshot = { stage: 'before', arr: curSnap.arr, num: 0, i: 0 }
                        snapshots.push(newSnap);
                        CONTINUE = true;
                        //
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
            retValue = curSnap.arr;//return arr;
            continue;

            break;
         case 'after'://code after recursive function call its self

            if (retValue == null) {
               
               curSnap.arr.splice(curSnap.arr.indexOf(curSnap.num), 1);
               curSnap.stage = 'before';
               curSnap.num++;
               snapshots.push(curSnap);
            }
            else {
               // retValue = curSnap.arr;//return arr; //!logically it should be return x; i.e only continue;
               continue;
            }
            
            break;
      }
   }

   //second rule
   return retValue;
}




/**
 * 
 * simplest example of backtrack algorithm.
 * array should fill with 0 to 9 numbers. where there are no repeated number and resolve if 0 to 9 exist.
 * Ex: [] -> [0,1,2,3,4,5,6,7,8,9]
 * [5, 3] -> [5,3,0,1,2,4,6,7,8,9]
 */
function solveRec(arr: number[]): number[] | null {
   //need touch
   for (let i = 0; i < SIZE; i++)//i is index
      if (needTouch(arr, arr[i])) {
         for (let num = 0; num < SIZE; num++)//num is value
            if (isPossible(arr, num)) {
               arr.push(num);
               let ret = solveRec(arr);
               if (ret == null)
                  arr.splice(arr.indexOf(num), 1);
               else return ret;
            }
         return null;
      }
   return arr;
}


/**
 * 
 * simplest example of backtrack algorithm.
 * array should fill with 0 to 9 numbers. where there are no repeated number and resolve if 0 to 9 exist.
 * Ex: [] -> [0,1,2,3,4,5,6,7,8,9]
 * [5, 3] -> [5,3,0,1,2,4,6,7,8,9]
 */
function solveRecUnstop(arr: number[]) {
   //need touch
   for (let i = 0; i < SIZE; i++)//i is index
      if (needTouch(arr, arr[i])) {
         for (let num = 0; num < SIZE; num++)//num is value
            if (isPossible(arr, num)) {
               arr.push(num);
               solveRecUnstop(arr);
               arr.splice(arr.indexOf(num), 1);
            }
         return;
      }
   console.log(arr)
}


function isPossible(arr: number[], n: number): boolean {
   if (arr.includes(n))
      return false;
   if (n > SIZE - 1 || n < 0)
      return false;
   return true;
}

function needTouch(arr: number[], x: number | undefined): boolean {
   if (arr.length === SIZE)
      return false;
   return !x;
}

