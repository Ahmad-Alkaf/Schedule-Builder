import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddSubtreeComponent } from './add-subtree/add-subtree.component';
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
interface Node {
  name: string,
  level?: number,
  children?: Node[] | { name: string, onClick?: Function }[] | undefined
  onClick?: Function
}
export interface DialogRootTreeSubmit {
  title: string;
  name?: string;
  certificate?: string;
}
/**
* Food data with nested structure.
* Each node has a name and an optional list of children.
*/
const TREE_DATA: Node[] = [
  {
    name: 'Teacher',
    children: [{ name: 'Ahmed Shaikh' }, { name: 'Hassen' }, { name: 'Hamzah' }, { name: '+ Add Teacher' }],
  },
  {
    name: 'Lesson',
    children: [{ name: 'PM' }, { name: 'HCI' }, { name: 'Server-side' }, { name: '+ Add Lesson' }],
  },
  {
    name: 'Room',
    children: [{ name: '301' }, { name: '401' }, { name: '302' }, { name: '+ Add Room' }]
  }
];
@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.css']
})

export class NavTreeComponent implements OnInit {
  constructor(public dialog: MatDialog) {
    this.dataSource.data = TREE_DATA;
  }
  /**VVVV Dialog VVVV */
  openAddDialog(data: DialogRootTreeSubmit): void {
    const dialogRef = this.dialog.open(AddSubtreeComponent, {
      width: '250px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.name)
        this.appendSourceData(result.title,{name:result.name})
      console.log('The dialog was closed result data=', result);
    });
  }

  addSubtreeHandler(rootTitle: string) {

    console.log('open dialog called');
    this.openAddDialog({ title: rootTitle })

  }


  /**^^^^  Dialog ^^^^ */
  /**VVVV  Tree   VVVV */
  appendSourceData(rootName: string, node: { name: string }) {
    for (let t of TREE_DATA) {
      if (t.name == rootName)
        if (t.children) {
          t.children[t.children?.length - 1] = node;
          t.children.push({ name: ('+ Add ' + t.name) })
          break;
        }
    }
    this.dataSource.data = TREE_DATA;
  }
  
  // setSourceData(treeData: Node[]) {
  //   let add = '+ Add ';

  //   for (let t of treeData) {
  //     console.log('pop', t.children?.pop());
  //     t.children?.push({ name: (add + t.name) });
  //   }
  //   // if (treeData[0].children && treeData[1].children && treeData[2].children) {
  //   //   treeData[0].children[treeData[0].children?.length - 1].onClick = this.addSubtreeHandler;
  //   //   treeData[1].children[treeData[0].children?.length - 1].onClick = this.addSubtreeHandler;
  //   //   treeData[2].children[treeData[0].children?.length - 1].onClick = this.addSubtreeHandler;
  //   //   console.log('click implement on', treeData[0].children[treeData[0].children?.length - 1].name)
  //   //   console.log('click implement on', treeData[1].children[treeData[0].children?.length - 1].name)
  //   //   console.log('click implement on', treeData[2].children[treeData[0].children?.length - 1].name)
  //   // }
  //   this.dataSource.data = treeData;
  // }

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


  ngOnInit(): void {

  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}

