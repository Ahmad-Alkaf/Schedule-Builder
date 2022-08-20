import { Injectable, OnInit } from '@angular/core';
import { Final, SolveLec, StaticLec, WEEK_DAYS } from './static';
import { Table } from './tableBinder';

@Injectable({
  providedIn: 'root',

})
export class GenerateTableService {
  private worker: Worker | undefined;

  public generateLectures(staticLecs: StaticLec[], solveLecs: SolveLec[], otherTables: Table[]/*,config:ConfigGen*/):Promise<SolveLec[]|null> {
    return new Promise((resolve, reject) => {
      if (Worker) {
        this.worker = new Worker(new URL('./gen-lectures.worker', import.meta.url));
        this.worker.postMessage(JSON.stringify([ staticLecs, solveLecs, otherTables.map(v=>({index:v.index, name:v.name, lectures:v.lectures})) ]));
        this.worker.onmessage = ({data}) => {
          var ret = JSON.parse(data);
          resolve(ret);
        }
      }else reject('Error: Your browser doesn\'t support Web Worker which is required to generate lectures without blocking the main process!')
    })
  }
  
  public terminate() {
    if (this.worker)
      this.worker.terminate();
    this.worker = undefined;
  }


}
