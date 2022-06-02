import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
interface Node {
  name: string,
  level?: number,
  children?: Node[] | { name: string, click?: Function }[] | undefined
  click?: Function
}
interface DialogData{
  title: string;
  
}
/**
* Food data with nested structure.
* Each node has a name and an optional list of children.
*/
const TREE_DATA: Node[] = [
  {
    name: 'Teachers',
    children: [{ name: 'Ahmed Shaikh' }, { name: 'Hassen' }, { name: 'Hamzah' }],
  },
  {
    name: 'Lessons',
    children: [{ name: 'PM' }, { name: 'HCI' }, { name: 'Server-side' }],
  },
  {
    name: 'Rooms',
    children: [{ name: '301' }, { name: '401' }, { name: '302' }]
  }
];
@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.css']
})

export class NavTreeComponent implements OnInit {
  constructor(public dialog: MatDialog) {
    this.setSourceData(TREE_DATA)
  }
  /**VVVV Dialog VVVV */
  openDialog(data:DialogData): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}




  /**^^^^  Dialog ^^^^ */
  /**VVVV  Tree   VVVV */


  private _transformer = (node: Node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  /** Flat node with expandable and level information */
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  setSourceData(treeData: Node[]) {
    let add = '+ Add ';
    for (let t of treeData)
      if (t.children)
        t.children.push({ name: (add + t.name) });
    if (treeData[0].children)
      treeData[0].children[treeData[0].children?.length - 1].click = (rootTree: string) => {

      }
    this.dataSource.data = treeData;
  }
  ngOnInit(): void {
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}