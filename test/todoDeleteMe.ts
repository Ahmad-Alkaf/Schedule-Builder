//! https://www.codeproject.com/Articles/418776/How-to-replace-recursive-functions-using-stack-and
// first rule
interface Snapshot {
   arr: number[];
   i: number, num: number;
   stage: 'before' | 'after';
}

type Pos = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
let emptyBoard: Pos[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 9],
];

console.time('time')
console.log(printBoard(solveRec(emptyBoard)))
console.timeEnd('time')

// function solveLoop(arrParam: number[]): number[] | null {
//    //second rule
//    let retValue: number[] | null = null;

//    //third rule
//    let snapshots: Snapshot[] = [];

//    //fourth rule
//    let curSnap: Snapshot = { stage: 'before', arr: arrParam, i: 0, num: 0 };
//    snapshots.push(curSnap);

//    //fifth rule
//    while (snapshots.length !== 0) {
//       curSnap = snapshots.pop() as Snapshot;//snapshots won't be empty if it entered the while loop
//       console.log(curSnap);
//       // console.log(curSnap)
//       //sixth rule
//       switch (curSnap.stage) {
//          case 'before'://code before recursive function call its self
//             let CONTINUE = false;
//             for (; curSnap.i < SIZE; curSnap.i++) {//i is index
//                if (needTouch(curSnap.arr, curSnap.arr[curSnap.i])) {
//                   for (; curSnap.num < SIZE; curSnap.num++) {//num is value
//                      if (isPossible(curSnap.arr, curSnap.num)) {
//                         curSnap.arr.push(curSnap.num);
//                         //solve() recursive call
//                         curSnap.stage = 'after';
//                         snapshots.push(curSnap);
//                         let newSnap: Snapshot = { stage: 'before', arr: curSnap.arr, num: 0, i: 0 }
//                         snapshots.push(newSnap);
//                         CONTINUE = true;
//                         //
//                      }
//                      if (CONTINUE) break;
//                   }
//                   if (CONTINUE) break;
//                   retValue = null;//return null;
//                   CONTINUE = true;
//                }
//                if (CONTINUE) break;
//             }
//             if (CONTINUE) continue;
//             retValue = curSnap.arr;//return arr;
//             continue;

//             break;
//          case 'after'://code after recursive function call its self

//             if (retValue == null) {

//                curSnap.arr.splice(curSnap.arr.indexOf(curSnap.num), 1);
//                curSnap.stage = 'before';
//                curSnap.num++;
//                snapshots.push(curSnap);
//             }
//             else {
//                // retValue = curSnap.arr;//return arr; //!logically it should be return x; i.e only continue;
//                continue;
//             }

//             break;
//       }
//    }

//    //second rule
//    return retValue;
// }




/**
 * 
 * simplest example of backtrack algorithm.
 * array should fill with 0 to 9 numbers. where there are no repeated number and resolve if 0 to 9 exist.
 * Ex: [] -> [0,1,2,3,4,5,6,7,8,9]
 * [5, 3] -> [5,3,0,1,2,4,6,7,8,9]
 */
function solveRec(board: Pos[][]): Pos[][]|null {
   
   for (let i = 0; i < 9; i++)
   for (let j = 0; j < 9; j++)
      if (needTouch(board, board[i][j])) {
         for (let num:Pos = 1; num <= 9; num++)//num is value
            if (isPossible(board,i,j,num as Pos)) {
               board[i][j] = num as Pos;
               let ret = solveRec(board);
               if (ret == null)
                  board[i][j] = 0;
               else return ret;
            }
         return null;
      }
   return board;
}


/**
 * 
 * simplest example of backtrack algorithm.
 */
// function solveRecUnstop(arr: number[]) {
//    //need touch
//    for (let i = 0; i < SIZE; i++)//i is index
//       if (needTouch(arr, arr[i])) {
//          for (let num = 0; num < SIZE; num++)//num is value
//             if (isPossible(arr, num)) {
//                arr.push(num);
//                solveRecUnstop(arr);
//                arr.splice(arr.indexOf(num), 1);
//             }
//          return;
//       }
//    console.log(arr)
// }


function isPossible(board:Pos[][], i:number,j:number,n:Pos): boolean {
   console.assert(!(n >= 10 || n <= 0), 'Logic Error value of sudoku should be 1-9');
   if (board[i].includes(n))
      return false;
   for (let k = 0; k < 9; k++)
      if (k !== i && board[k][j] === n)
         return false;
   return true;
}

function needTouch(arr: Pos[][], pos: Pos): boolean {
   return pos === 0;
}


function printBoard(board: Pos[][] | null): String{
   if (board == null)
      return 'NULL';
   else {
      let out = ''
      for (let b of board)
         out += b + '\n';
      return out;
   }
}