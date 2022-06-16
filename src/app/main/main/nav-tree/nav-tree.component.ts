import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddSubtreeComponent } from '../../../dialog/add-subtree/add-subtree.component';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
interface Node {
  children?: Node[];
  name: string;
}

/** Flat to-do item node with expandable and level information */
interface FlatNode {
  name: string;
  level: number;
  expandable: boolean;
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
// const TREE_DATA: Node[] = [
//   {
//     name: 'Teacher',
//     children: [{ name: 'Ahmed Shaikh' }, { name: 'Hassen' }, { name: 'Hamzah' }, { name: '+ Add Teacher' }],
//   },
//   {
//     name: 'Lesson',
//     children: [{ name: 'PM' }, { name: 'HCI' }, { name: 'Server-side' }, { name: '+ Add Lesson' }],
//   },
//   {
//     name: 'Room',
//     children: [{ name: '301' }, { name: '401' }, { name: '302' }, { name: '+ Add Room' }]
//   }
// ];
const TREE_DATA = {
  Teacher: {
    'Ahmed Shaikh':null, 
    'Hassen':null, 
    'Hamzah':null,
 
  },
  Lesson: {
    'PM': null,
    'HCI': null,
    'Server-side': null
  },
  Room: {
    '301': null,
    '401':null,
    '302':null
  }
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
class ChecklistDatabase {
  dataChange = new BehaviorSubject<Node[]>([]);

  get data(): Node[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `Node` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `Node`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): Node[] {
    return Object.keys(obj).reduce<Node[]>((accumulator, key) => {
      const value = obj[key];
      const node:Node = {name:key}

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.name = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: Node, name: string) {
    if (parent.children) {
      parent.children.push({ name } as Node);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: Node, name: string) {
    node.name = name;
    this.dataChange.next(this.data);
  }
}


@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.css'],
  providers: [ChecklistDatabase]
})

export class NavTreeComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<FlatNode, Node>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<Node, FlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: FlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<FlatNode>;

  treeFlattener: MatTreeFlattener<Node, FlatNode>;

  dataSource: MatTreeFlatDataSource<Node, FlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<FlatNode>(true /* multiple */);

  constructor(public dialog: MatDialog, private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<FlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    // this.dataSource.data = TREE_DATA;
    // console.log('source', this.dataSource);
    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  /**VVVV  Tree   VVVV */



  getLevel = (node: FlatNode) => node.level;

  isExpandable = (node: FlatNode) => node.expandable;

  getChildren = (node: Node): Node[] => node.children || [];

  hasChild = (_: number, _nodeData: FlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: FlatNode) => _nodeData.name === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: Node, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name ? existingNode : {}as FlatNode;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: FlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: FlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }
}

