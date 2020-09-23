import { Component, OnInit } from '@angular/core';
import { STColumn, STPage } from '@delon/abc';
import { NzContextMenuService, NzDropdownMenuComponent, NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd';
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
const r = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)
@Component({
  selector: 'app-pipe-network-deployment-details',
  templateUrl: './pipe-network-deployment-details.component.html',
  styleUrls: ['./pipe-network-deployment-details.component.less']
})
export class PipeNetworkDeploymentDetailsComponent implements OnInit {



  constructor(private nzContextMenuService: NzContextMenuService) { }
  // myContext = { $implicit: 'World', localSk: 'Svet' };
  // treeData: treeData[] = [];
  tmpParentNode = {};//父级信息
  tmpNode = {};//当前级信息
  tmpChildrenNode = [];//子级信息
  nodes: NzTreeNodeOptions[] = [
    {
      title: '一二期进水主管网', key: '001', expanded: true, children: [
        { title: '附属楼', key: '001-001', isLeaf: true, },
        { title: '电脑公司厂房1', key: '001-002', isLeaf: true, },
        { title: '电脑公司厂房2', key: '001-003', isLeaf: true, },
        { title: 'B楼/生产试验楼-1路', key: '001-004', isLeaf: true, },
        { title: 'B楼/生产试验楼-2路', key: '001-005', isLeaf: true, },
        {
          title: 'A楼/研发中心叠压设备', key: '001-006', expanded: true, children: [
            {
              title: 'A楼叠压设备出口', key: '001-006-001', expanded: true, children: [
                { title: 'B楼东北侧3-5层卫生间', key: '001-006-001-001', isLeaf: true, },
                { title: 'B楼西南侧3-5层卫生间', key: '001-006-001-001', isLeaf: true, },
              ],
            },
            { title: 'A楼1-5层卫生间', key: '001-006-002', isLeaf: true, },

          ],
        },
        { title: 'A楼1-5层卫生间', key: '001-007', isLeaf: true, },
        { title: '新大陆地产公司', key: '001-008', isLeaf: true, },
      ]
    },
    {
      title: '三期进水主管网', key: '002', expanded: true, children: [
        {
          title: '生活用水', key: '002-001', expanded: true, children: [
            {
              title: '弘卓中庭', key: '002-001-001', expanded: true, children: [
                { title: '1层进货口女厕', key: '002-001-001-001', isLeaf: true, },
                { title: '2层餐厅大厅', key: '002-001-001-002', isLeaf: true, },
                { title: '3层餐厅大厅', key: '002-001-001-003', isLeaf: true, },
                { title: '4层餐厅大厅', key: '002-001-001-004', isLeaf: true, },
              ]
            },
            {
              title: '弘卓主楼', key: '002-001-002', expanded: true, children: [
                { title: '1层卫生间用水', key: '002-001-002-001', isLeaf: true, },
                { title: '2层卫生间用水', key: '002-001-002-002', isLeaf: true, },
                { title: '3层卫生间用水', key: '002-001-002-003', isLeaf: true, },
                { title: '4层包间', key: '002-001-002-004', isLeaf: true, },
              ]
            },
            {
              title: '弘卓地下室', key: '002-001-003', children: [

              ]
            },
            {
              title: '弘卓外围绿化用水', key: '002-001-004', children: [
                { title: '南洗水池', key: '002-001-004-001', isLeaf: true, },
                { title: '北洗水池', key: '002-001-004-002', isLeaf: true, },
                { title: '绿化用水', key: '002-001-004-003', isLeaf: true, },
              ]
            },
          ]
        }
      ]
    }
  ];
  pipeData = [];
  leakData = [];
  columns: STColumn[] = [
    { title: '设备', index: 'device', },
    { title: '正向累计流量/m³', index: 'pcf' },
    { title: '反向累计流量/m³', index: 'rcf', },
  ];
  leakRateColumns: STColumn[] = [
    { title: '漏损量/m³', index: 'leakNum', },
    { title: '漏损率%', index: 'leakRate' },
  ];
  leakRatePage: STPage = {
    show: false,
  };
  isAlarm: boolean = false;
  alarmMsg: string = "";
  ngOnInit() {
    // preve();
  }
  ngOnDestory() {
    // preve.complete();
  }
  //点击某节点其获取父子节点信息
  nodeTreeClick(data: NzFormatEmitEvent) {
    // console.log(data.node);
    let parentNode = data.node.getParentNode();
    let childrenNode = data.node.getChildren();
    // console.log(parentNode);
    // console.log(childrenNode);
    // console.log(childrenNode);
    this.tmpParentNode = parentNode;
    this.tmpChildrenNode = childrenNode;
    this.tmpNode = data.node;
    if (this.tmpParentNode == null) {
      this.tmpParentNode = {}
    }
    // console.log(this.tmpParentNode);
    this.pipeData = [];
    this.pipeData.push({
      "device": data.node.title,
      "pcf": 2000,
      "rcf": 0
    });

    this.tmpChildrenNode.forEach((item, k) => {
      this.pipeData.push({
        "device": item.title,
        "pcf": Math.floor(this.pipeData[0].pcf / this.tmpChildrenNode.length),
        "rcf": 0
      });
    })
    this.leakData = [];
    this.leakData.push({
      "leakNum": this.calNum(),
      "leakRate": this.calleak(),
    })
    this.isAlarm = false;
    if (this.calNum() / this.pipeData[0].pcf > 0) {
      this.isAlarm = true;
      this.alarmMsg = `${data.node.title} 至 下级水表管段 存在漏损,请及时检修!`
    }
    // console.log(this.leakData)
  }
  //计算正向漏损量和正向漏损率
  calNum(): number {
    let result: number;

    let childSum: number = 0;
    let parentNum = this.pipeData[0].pcf;
    let p = this.pipeData.slice();
    p.shift();
    let children = p;
    // console.log(parentNum, children);
    if (this.tmpChildrenNode.length > 0) {
      children.forEach((item, k) => {
        childSum += item.pcf;
      })
      result = parentNum - childSum;
    } else {
      result = 0;
    }

    return result;
  }
  //计算漏损率
  calleak(): string {
    let result: string;
    let parentNum = this.pipeData[0].pcf;
    result = (this.calNum() / parentNum).toFixed(3) + "%";
    return result;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
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
