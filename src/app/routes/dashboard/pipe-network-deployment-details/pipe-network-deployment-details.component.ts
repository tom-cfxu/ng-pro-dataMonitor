import { Component, OnInit } from '@angular/core';
let preve = () => { document.oncontextmenu = function () { return false; }; }

//定义接口
interface tree {
  id: string;
  name: string;
  value: string;
  level: string;
  parentName: string;
  children?: Array<tree>
}
interface treeData {
  id: string;
  name: string;
  value: string;
  children?: Array<tree>
}
@Component({
  selector: 'app-pipe-network-deployment-details',
  templateUrl: './pipe-network-deployment-details.component.html',
  styleUrls: ['./pipe-network-deployment-details.component.less']
})
export class PipeNetworkDeploymentDetailsComponent implements OnInit {


  constructor() { }
  myContext = { $implicit: 'World', localSk: 'Svet' };
  treeData: treeData[] = [];
  ngOnInit() {
    preve();
  }
  ngOnDestory() {
    // preve.complete();
  }
  addTreeNode() {
    let id = `${this.treeData.length > 0 ? this.treeData[this.treeData.length - 1].id + 1 : 0}`;
    // console.log(id);
    this.treeData.push({
      id,
      name: 'new tree',
      value: 'dsd',
      children: []
    })
    // if(this.addTreeNode.length>0)
  }
  //递归对象,找到name相同的对象的children添加新对象
  recAddNode(obj, id) {
    if (obj.id == id) {
      let id = `${obj.children.length > 0 ? obj.children[obj.children.length - 1].id + 1 : 0
        }`;
      obj.children.push({
        id: `${obj.id}-${id}`,
        name: '1',
        value: '1',
        level: '1',
        parentName: obj.name,
        children: []
      })
      return
    } else {
      obj.children.forEach((child) => {
        this.recAddNode(child, id)
      })
    }

  }
  addchildNode(id) {
    this.treeData.forEach(obj => {
      this.recAddNode(obj, id)
    })
  }
}
