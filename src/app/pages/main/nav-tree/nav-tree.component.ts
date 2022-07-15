import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { DataService } from 'src/app/services/data.service';
import { ApiService } from 'src/app/services/api.service';

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
  styleUrls: ['./nav-tree.component.css']
})

export class NavTreeComponent implements OnInit {

 
  
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

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
    let n: FlatNode = { ...this.treeData[this.treeData.indexOf(node)] ,name: value };
    
    this.treeData[this.treeData.indexOf(node)] = n;
    this.dataSource = new ArrayDataSource(this.treeData);
    let parent = this.getParentNode(n);
    if (parent == null)
      return console.error('parent in tree is null!')
    switch (parent.name) {
      case 'Teacher': this.dataService.teachers.push({ name: value }); break;
      case 'Subject': this.dataService.subjects.push({ name: value }); break;
      case 'Room': this.dataService.rooms.push({ name: value }); break;
      default: console.error('default in switch called is must not!');
    }
    this.dataService.saveState();
  }

  removeInput(node: FlatNode) {
    for (let i = this.treeData.indexOf(node)+1; i < this.treeData.length; i++)
      if (this.treeData[i].expandable == true)
        break;
      else if (this.treeData[i].name === ' ') {
        this.treeData.splice(i, 1);
        i--;
        // break;
      }
    this.dataSource = new ArrayDataSource<FlatNode>(this.treeData);
  }

  ngOnInit(): void {
    Promise.all([this.api.pullTeachers(), this.api.pullSubjects(), this.api.pullRooms()])
      .then(([teachers, subjects, rooms]) => {
        this.dataService.teachers = teachers;
        this.dataService.subjects = subjects;
        this.dataService.rooms = rooms;
        console.log({ teachers, subjects, rooms });
        this.treeData = this.createFlatNode();
        this.dataSource = new ArrayDataSource(this.treeData);
        
      }).catch(e => console.error('nav-tree', e));
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

  treeData = this.createFlatNode();

  dataSource: ArrayDataSource<FlatNode> = new ArrayDataSource<FlatNode>(this.treeData)

  constructor(private dataService: DataService,private api:ApiService) {
  }

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
    let teachers = this.dataService.teachers;
    let subjects = this.dataService.subjects;
    let rooms = this.dataService.rooms;
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

