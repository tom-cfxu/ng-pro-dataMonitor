import { Component, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd';
// let preve = () => { document.oncontextmenu = function () { return false; }; }

//定义接口
// interface tree {
//   id: string;
//   name: string;
//   value: string;
//   level: string;
//   parentName: string;
//   children?: Array<tree>
// }
// interface treeData {
//   id: string;
//   name: string;
//   value: string;
//   children?: Array<tree>
// }
@Component({
  selector: 'app-pipe-network-deployment-details',
  templateUrl: './pipe-network-deployment-details.component.html',
  styleUrls: ['./pipe-network-deployment-details.component.less']
})
export class PipeNetworkDeploymentDetailsComponent implements OnInit {


  constructor() { }
  // myContext = { $implicit: 'World', localSk: 'Svet' };
  // treeData: treeData[] = [];
  nodes: NzTreeNodeOptions[] = [
    {
      title: '一二期进水主管网', key: '001', expanded: true, children: [
        { title: '附属楼', key: '001-001', isLeaf: true, },
        { title: '电脑公司厂房1', key: '001-002', isLeaf: true, },
        { title: '电脑公司厂房2', key: '001-003', isLeaf: true, },
        { title: 'B楼/生产试验楼-1路', key: '001-004', isLeaf: true, },
        { title: 'B楼/生产试验楼-2路', key: '001-005', isLeaf: true, },
        { title: 'A楼/研发中心叠压设备', key: '001-006', children: [] },
      ]
    }
  ];
  ngOnInit() {
    // preve();
  }
  ngOnDestory() {
    // preve.complete();
  }
  // addTreeNode() {
  //   let id = `${this.treeData.length > 0 ? this.treeData[this.treeData.length - 1].id + 1 : 0}`;
  //   // console.log(id);
  //   this.treeData.push({
  //     id,
  //     name: 'new tree',
  //     value: 'dsd',
  //     children: []
  //   })
  //   // if(this.addTreeNode.length>0)
  // }
  // //递归对象,找到name相同的对象的children添加新对象
  // recAddNode(obj, id) {
  //   if (obj.id == id) {
  //     let id = `${obj.children.length > 0 ? obj.children[obj.children.length - 1].id + 1 : 0
  //       }`;
  //     obj.children.push({
  //       id: `${obj.id}-${id}`,
  //       name: '1',
  //       value: '1',
  //       level: '1',
  //       parentName: obj.name,
  //       children: []
  //     })
  //     return
  //   } else {
  //     obj.children.forEach((child) => {
  //       this.recAddNode(child, id)
  //     })
  //   }

  // }
  // addchildNode(id) {
  //   this.treeData.forEach(obj => {
  //     this.recAddNode(obj, id)
  //   })
  // }
}
