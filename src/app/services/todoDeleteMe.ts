// console.log('started');
// const SIZE = 1000;
// solve([])
// /**
//  * 
//  * simplest example of backtrack algorithm.
//  * array should fill with 0 to 9 numbers. where there are no repeated number and resolve if 0 to 9 exist.
//  * Ex: [] -> [0,1,2,3,4,5,6,7,8,9]
//  * [5, 3] -> [5,3,0,1,2,4,6,7,8,9]
//  */
// async function solve(arr: number[]) {
//    //need touch
//    for (let i = 0; i < SIZE; i++)//i is index
//       if (needTouch(arr, arr[i])) {
//          for (let num = 0; num < SIZE; num++)//num is value
//             if (isPossible(arr, num)) {
//                arr.push(num);
//                solve(arr);
//                arr.splice(arr.indexOf(num), 1);
//             }
//          return;
//       }
//    console.log(arr.toString())
// }

// function isPossible(arr: number[], n: number): boolean {
//    if (arr.includes(n))
//       return false;
//    if (n > SIZE-1 || n < 0)
//       return false;
//    return true;
// }

// function needTouch(arr: number[], x: number | undefined): boolean {
//    if (arr.length === SIZE)
//       return false;
//    return !x;
// }

// function askQuestion(query: string):Promise<string> {
//    const rl = createInterface({
//       input: process.stdin,
//       output: process.stdout,
//    });

//    return new Promise(resolve => rl.question(query, (ans:string) => {
//       rl.close();
//       resolve(ans);
//    }))
// }


