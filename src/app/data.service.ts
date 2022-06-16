import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  teachers: string[] = [];
  lessons: string[] = [];
  rooms: string[] = [];
  constructor() { }
}
