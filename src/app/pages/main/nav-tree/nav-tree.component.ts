import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { DataService } from '@service/data.service';
import { ApiService } from '@service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Room, Subject, Teacher } from '@service/static';

/** Flat to-do item node with expandable and level information */
interface FlatNode {
  name: string;
  level: number;
  expandable: boolean;
  isExpanded?: boolean;
}



@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.scss']
})

export class NavTreeComponent implements OnInit {



  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeData = this.createFlatNode();

  dataSource: ArrayDataSource<FlatNode> = new ArrayDataSource<FlatNode>(this.treeData)


  constructor(private dataService: DataService, private api: ApiService, private snackbar: MatSnackBar) {
  }


  getMappedNodeInDataService(node: FlatNode): [obj: Teacher | Subject | Room, index: number, attr: 'teachers' | 'subjects' | 'rooms'] {
    let parent_ = this.getParentNode(node);
    let parent: FlatNode;
    if (parent_ == null) throw new Error('parent node: ' + node + ' of removed tree leave is null:' + parent_)
    else parent = parent_;

    let tmp: (Teacher | Subject | Room) | undefined = undefined;
    let index: number;
    let attr: 'teachers' | 'subjects' | 'rooms';
    switch (parent.name) {
      case 'Teacher': tmp = this.dataService.teachers.value.filter(v => v.name == node.name)[0]; index = this.dataService.teachers.value.indexOf(tmp); attr = 'teachers'; break;
      case 'Subject': tmp = this.dataService.subjects.value.filter(v => v.name == node.name)[0]; index = this.dataService.subjects.value.indexOf(tmp); attr = 'subjects'; break;
      case 'Room': tmp = this.dataService.rooms.value.filter(v => v.name == node.name)[0]; index = this.dataService.rooms.value.indexOf(tmp); attr = 'rooms'; break;
      default: throw new Error('default in switch called is must not!');
    }

    console.log({ tmp, parent })
    if (index < 0)
      throw new Error('indexOf is -1 but it should exist in the array!!!');
    return [tmp, index, attr];
  }

  removeNode(node: FlatNode) {
    let nodeIndex = this.treeData.indexOf(node);
    let [tmp, index, attr] = this.getMappedNodeInDataService(node);
    let parentNode = this.getParentNode(node) as FlatNode;
    this.treeData.splice(nodeIndex, 1);
    this.dataSource = new ArrayDataSource<FlatNode>(this.treeData);
    let toDelete = setTimeout(() => {
      this.dataService[attr].next(this.dataService[attr].value.splice(index, 1));
      parentNode = this.treeData.filter(v => v.name == parentNode.name)[0];
      parentNode.isExpanded = true;
      this.treeControl.expand(parentNode);
      this.dataService.saveState();
    }, 4000);

    this.snackbar.open(`${parentNode.name} '${node.name}' Removed!`, 'Undo', { duration: 3999 }).onAction().subscribe({
      next: () => {
        this.treeData.splice(nodeIndex, 0, { name: tmp.name, level: 1, expandable: false })
        this.dataSource = new ArrayDataSource(this.treeData);
        clearTimeout(toDelete);
      }
    })
  }

  handleAdd(node: FlatNode) {//handleAdd is for button that only in root tree i.e (teacher, subject and room)
    let parentIndex = this.treeData.indexOf(node);
    node.isExpanded = true;
    this.treeData.splice(this.addNewIndex(node, parentIndex), 0, { name: ' ', level: node.level + 1, expandable: false });
    this.dataSource = new ArrayDataSource<FlatNode>(this.treeData);
    this.treeControl.expand(node);
  }

  addNewIndex(parent: FlatNode, index: number): number {
    for (let i = index + 1; i < this.treeData.length; i++) {
      if (this.treeData[i].expandable)
        return i;
    }
    return this.treeData.length;
  }

  saveNewNode(node: FlatNode, value: string) {
    value = value.trim();

    // let n: FlatNode = { ...this.treeData[this.treeData.indexOf(node)], name: value };
    console.log({ tree: this.treeData })
    let mappedAttr: 'teachers' | 'subjects' | 'rooms' | undefined;
    let parentNode: FlatNode | undefined = undefined;
    for (let t of this.treeData)//find parent
      if (t.level == 0) {
        parentNode = t;
        mappedAttr = t.name.toLowerCase() + 's' as 'teachers' | 'subjects' | 'rooms';
      }
      else if (t.name == ' ')
        break;
        if (mappedAttr == undefined || parentNode == undefined)
          throw new Error('parent in tree is null!' + mappedAttr);
    if (this.dataService[mappedAttr].value.some((v)=>v.name == value)) {//check uniqueness
      this.snackbar.open(`There Exists ${parentNode?.name||'Entity'} With Same Name '${value}'!`, undefined, { duration: 3999 });
      return;
    }


    this.dataService[mappedAttr].next([...this.dataService[mappedAttr].value, { name: value }]);
    let n = this.getParentNode(this.treeData.filter(v => v.name == value)[0]) || { name: '', level: 1, expandable: false };
    n.isExpanded = true;
    this.treeControl.expand(n);
    this.dataService.saveState();
  }
  
  // isUniqueValue(attr: 'teachers'|'subjects'|'rooms', value: string):boolean {
  //   for (let i = 0; i < this.treeData.length; i++)
  //     if (this.treeData[i] == parentNode) {//check nodes that are in same level or children of parentNode
  //       for (i = i + 1; this.treeData[i].level > 0 && i < this.treeData.length; i++) {
  //         if (this.treeData[i].name == value)
  //           return false;
  //       }
  //       return true;
  //     }
  //     return true;
  // }

  removeInput(node: FlatNode) {
    for (let i = this.treeData.indexOf(node) + 1; i < this.treeData.length; i++)
      if (this.treeData[i].expandable == true)
        break;
      else if (this.treeData[i].name === ' ') {
        this.treeData.splice(i, 1);
        i--;
      }
    this.dataSource = new ArrayDataSource<FlatNode>(this.treeData);
  }

  ngOnInit(): void {
    let next = {
      next: () => {
        this.treeData = this.createFlatNode();
        this.dataSource = new ArrayDataSource(this.treeData);

      }
    }
    this.dataService.teachers.subscribe(next);
    this.dataService.subjects.subscribe(next);
    this.dataService.rooms.subscribe(next);

  }

  hasNoContent = (_: number, node: FlatNode): boolean => {
    let has = node.name === ' ';
    if (!has)
      return has;

    let parent = this.getParentNode(node);
    if (parent && parent.isExpanded)
      return true;
    return false;
  };
  hasChild = (_: number, node: FlatNode) => node.expandable;



  getParentNode(node: FlatNode) {
    const nodeIndex = this.treeData.indexOf(node);

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (this.treeData[i].level === node.level - 1) {
        return this.treeData[i];
      }
    }

    return null;
  }

  shouldRender(node: FlatNode) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }



  createFlatNode(): FlatNode[] {
    let teachers = this.dataService.teachers.value;
    let subjects = this.dataService.subjects.value;
    let rooms = this.dataService.rooms.value;
    let tree: FlatNode[] = [];

    tree.push({
      name: 'Teacher',//saveNewNode use this.
      level: 0,
      expandable: true
    })
    for (let t of teachers)
      tree.push({ name: t.name, level: 1, expandable: false })

    tree.push({
      name: 'Subject',//saveNewNode use this.
      level: 0,
      expandable: true
    })
    for (let s of subjects)
      tree.push({ name: s.name, level: 1, expandable: false })

    tree.push({
      name: 'Room',//saveNewNode use this.
      level: 0,
      expandable: true
    })
    for (let r of rooms)
      tree.push({ name: r.name, level: 1, expandable: false })

    return tree;
  }
}

