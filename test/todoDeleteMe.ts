//! https://www.codeproject.com/Articles/418776/How-to-replace-recursive-functions-using-stack-and
// first rule
interface Snapshot {
   board:Pos[][]
   i: number,j:number, num: Val;
   stage: 'before' | 'after';
}

type Pos = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Val = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
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
// printBoard(solveRec(emptyBoard))
// solveRecUnstop(emptyBoard)
printBoard(solveLoop(emptyBoard))
console.timeEnd('time')

function solveLoop(board: Pos[][]): Pos[][] | null {
   //second rule
   let retValue: Pos[][] | null = null;

   //third rule
   let snapshots: Snapshot[] = [];

   //fourth rule
   let curSnap: Snapshot = { stage: 'before', board, i: 0,j:0, num: 1 };
   snapshots.push(curSnap);

   //fifth rule
   recursive: while (snapshots.length !== 0) {
      curSnap = snapshots.pop() as Snapshot;//snapshots won't be empty if it entered the while loop
      // printBoard(curSnap.board);
      // console.log('\n'+curSnap.board[0].toString()+'\n'+curSnap.board[1].toString()+'  '+curSnap.stage);
      // console.log('i=',curSnap.i)
      // console.log('j=',curSnap.j)
      // console.log('num=',curSnap.num)
      // console.log('snapshots=', snapshots.length);
      // console.log(curSnap)
      
      //sixth rule
      switch (curSnap.stage) {
         case 'before'://code before recursive function call its self
            // let CONTINUE = false;
            for (; curSnap.i < 9; curSnap.i++,curSnap.j = 0) {//i is index
               for (; curSnap.j < 9; curSnap.j++,curSnap.num = 1) {//i is index
                  if (needTouch(curSnap.board, curSnap.board[curSnap.i][curSnap.j])) {
                     for (; curSnap.num <= 9; curSnap.num++) {//num is value
                        if (isPossible(curSnap.board,curSnap.i,curSnap.j, curSnap.num as Pos)) {
                           curSnap.board[curSnap.i][curSnap.j] = curSnap.num as Pos;
                           //solve() recursive call
                           curSnap.stage = 'after';
                           snapshots.push(curSnap);
                           let newSnap: Snapshot = { stage: 'before', board:curSnap.board, num: 1, i: 0,j:0 }
                           snapshots.push(newSnap);
                           // CONTINUE = true;
                           continue recursive;
                           //
                        }
                        // if (CONTINUE) break;
                     }
                     // if (CONTINUE) break;
                     retValue = null;//return null;
                     // CONTINUE = true;
                     continue recursive;
                     // break;
                  }
                  // if (CONTINUE) break;
               }
               // if (CONTINUE) break;
            }
            // if (CONTINUE) continue start;
            retValue = curSnap.board;//return board;
            continue;

         case 'after'://code after recursive function call its self

            if (retValue == null) {

               curSnap.board[curSnap.i][curSnap.j] = 0;
               curSnap.stage = 'before';
               curSnap.num++;
               snapshots.push(curSnap);
            }
            else {
               retValue = curSnap.board;//return arr; //!logically it should be return x; i.e only continue;
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
function solveRec(board: Pos[][]): Pos[][] | null {

   for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++)
         if (needTouch(board, board[i][j])) {
            for (let num: Pos = 1; num <= 9; num++)//num is value
               if (isPossible(board, i, j, num as Pos)) {
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
function solveRecUnstop(board: Pos[][]) {

   for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++)
         if (needTouch(board, board[i][j])) {
            for (let num: Pos = 1; num <= 9; num++)//num is value
               if (isPossible(board, i, j, num as Pos)) {
                  board[i][j] = num as Pos;
                  solveRecUnstop(board);
                  board[i][j] = 0;
               }
            return;
         }
   printBoard(board);

}


function isPossible(board: Pos[][], i: number, j: number, n: Pos): boolean {
   console.assert(!(n >= 10 || n <= 0), 'Logic Error: value of sudoku should be 1-9 get ='+n);
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


function printBoard(board: Pos[][] | null): void {
   console.log('\x1Bc');//clear console (cls)
   if (board == null)
      console.log('NULL')
   else {
      let out = ''
      for (let b of board)
         out += (b + '\n')
      console.log(out);
   }
}