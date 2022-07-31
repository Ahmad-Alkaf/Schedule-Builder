import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavTreeComponent } from '@page/main/nav-tree/nav-tree.component';

/**
 * 
   * @returns AfterClose result will be your (yes or no) text attribute. Ex: if you pass yes:{text:"Save",...}, then you should insure afterClose.subscribe((res)=>{if(res==="Save")...}).
 */
export interface Prompt {
  title: { text: string; color?: string; };
  content: string;
  /**
   * Won't be any Actions if actions is undefined.
   * @pram yes e.g,(Yes, Ok, Save, Done, Delete...etc).
   * @pram no, e.g,(No, Cancel, Ignore, Back...etc).
   */
  actions?: {
    yes: { text: string, color: 'primary'|'accent'|'warn' }, no: { text: string, color: 'primary'|'accent'|'warn' }
  }
}
@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent {

  constructor(public dialogRef: MatDialogRef<NavTreeComponent>, @Inject(MAT_DIALOG_DATA) public data: Prompt) { }



}
