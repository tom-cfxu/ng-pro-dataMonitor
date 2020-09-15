import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
// import { tap, map } from 'rxjs/operators';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { HttpService } from '@core/services/http.service';
// import { resolve } from 'url';

//js重复某个字符串n次
const repeat = (str, n) => new Array(n + 1).join(str);
//十进制转二进制 再补成8位格式  如64=>01000000
const decToBin = (num: number) => {
  let bin = num.toString(2)
  if (bin.length < 8) bin = repeat("0", 8 - bin.length) + bin;
  return bin;
}
//处理时间格式
const dateFormat = (date: string) => `20${date.slice(0, 2)}-${date.slice(2, 4)}-${date.slice(4, 6)} ${date.slice(6, 8)}:${date.slice(8)}`

//返回对象
const statusObject = (statusText, statusType, status) => { return { statusText, statusType, status, statusBin: decToBin(status) } }

@Component({
  selector: 'app-realtime-data-monitor',
  templateUrl: './realtime-data-monitor.component.html',
  styleUrls: ['./realtime-data-monitor.component.less']
})
export class RealtimeDataMonitorComponent implements OnInit, OnDestroy {
  private timer;
  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    // private modalSrv: NzModalService,
    // private cdr: ChangeDetectorRef,
    private httpService: HttpService
  ) {
    this.timer = setInterval(() => {
      this.searchMode ? this.filterData() : this.getData();
    }, 2000)
  }

  q: any = {
    pi: 1,
    ps: 10,
    equipId: null,
    sorter: '',
    status: null,
    alarms: null,
    statusList: [],
  };
  data: any[] = [];
  loading = false;
  searchMode = false;
  status = [
    { index: 0, text: '设备正常', value: false, type: 'success', checked: false },
    { index: 1, text: '传感器故障', value: false, type: 'error', checked: false },
    { index: 2, text: '计量欠压(内电池)', value: false, type: 'error', checked: false },
    { index: 3, text: '不能进入低功耗模式', value: false, type: 'error', checked: false },
    { index: 4, text: '信号覆盖等级0', value: false, type: 'default', checked: false },
    { index: 5, text: '信号覆盖等级1', value: false, type: 'default', checked: false },
    { index: 6, text: '信号覆盖等级2', value: false, type: 'default', checked: false },
  ];
  alarms = [
    { index: 0, text: '设备正常', value: false, type: 'success', checked: false },
    { index: 1, text: '超磁报警', value: false, type: 'error', checked: false },
    { index: 2, text: '开盖报警', value: false, type: 'error', checked: false },
    { index: 3, text: '压力下限报警', value: false, type: 'error', checked: false },
    { index: 4, text: '压力上限报警', value: false, type: 'error', checked: false },
    { index: 5, text: '模组欠压(低于3.2V)', value: false, type: 'error', checked: false },
    { index: 6, text: 'FOTA升级完成报警', value: false, type: 'error', checked: false },
    { index: 7, text: '重传上报次数0', value: false, type: 'default', checked: false },
    { index: 8, text: '重传上报次数1', value: false, type: 'default', checked: false },
    { index: 9, text: '重传上报次数2', value: false, type: 'default', checked: false },
    { index: 10, text: '重传上报次数3', value: false, type: 'default', checked: false },
  ];

  @ViewChild('st', { static: true })
  st: STComponent;
  columns: STColumn[] = [
    { title: '序号', index: 'id', width: 20 },
    { title: '设备编号', index: 'equipId', width: 30 },
    { title: '设备类型', index: 'equipType', width: 20 },
    { title: '设备状态', index: 'equipStatus', render: "equipStatus", width: 60 },
    { title: '报警状态', index: 'dataAlarm', render: "dataAlarm", width: 20 },
    { title: '数据类型', index: 'dataType', width: 20 },
    { title: '信号强度', index: 'rsrp', width: 20 },
    { title: '信噪比', index: 'snr', width: 20 },
    { title: '电池电量(%)', index: 'battery', width: 20, format: (item: any) => `${item.battery}%`, },
    { title: '采集时间', index: 'updateTime', width: 20 },
    { title: '正向累计流量(m³/h)', index: 'positiveFlow', width: 20 },
    { title: '反向累计流量(m³/h)', index: 'negativeFlow', width: 20 },
    { title: '瞬时流量(m³/h)', index: 'instantFlow', width: 20, sorter: (a: any, b: any) => a.instantFlow - b.instantFlow, },
    { title: '压力(N)', index: 'pressure', width: 20 },
    { title: '温度(℃)', index: 'temperature', width: 20 },
  ];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;

  //处理设备状态 返回对象数组
  handelEquipStatus(status: number) {
    //转为二进制的状态
    const result = []
    const statusBin: any = decToBin(status);
    if (statusBin.slice(0, 6) == "000000") {
      result.push(statusObject("设备正常", "success", status))
    }
    if (statusBin[0] == "1") {
      result.push(statusObject("传感器故障", "error", status))
    }
    if (statusBin[1] == "1") {
      result.push(statusObject("计量欠压", "error", status))
    }
    if (statusBin[2] == "1") {
      result.push(statusObject("不能进入低功耗模式", "error", status))
    }
    switch (statusBin.slice(6)) {
      case "00": result.push(statusObject("信号覆盖等级0", "default", status));
        break;
      case "01": result.push(statusObject("信号覆盖等级1", "default", status));
        break;
      case "10": result.push(statusObject("信号覆盖等级2", "default", status));
        break;
    }
    return result;
  }
  //处理设备报警
  handelEquipAlarm(status: number) {
    //转为二进制的状态
    const result = []
    const statusBin: any = decToBin(status);
    if (statusBin.slice(2) == "000000") {
      result.push(statusObject("设备正常", "success", status))
    }
    if (statusBin[7] == "1") {
      result.push(statusObject("超磁报警", "error", status))
    }
    if (statusBin[6] == "1") {
      result.push(statusObject("开盖报警", "error", status))
    }
    if (statusBin[5] == "1") {
      result.push(statusObject("压力下限报警", "error", status))
    }
    if (statusBin[4] == "1") {
      result.push(statusObject("压力上限报警", "error", status))
    }
    if (statusBin[3] == "1") {
      result.push(statusObject("模组欠压(低于3.2V)", "error", status))
    }
    if (statusBin[2] == "1") {
      result.push(statusObject("FOTA升级完成报警", "error", status))
    }
    // console.log(statusBin.slice(6))
    switch (statusBin.slice(0, 2)) {
      case "00": result.push(statusObject("重传上报次数0", "default", status));
        break;
      case "01": result.push(statusObject("重传上报次数1", "default", status));
        break;
      case "10": result.push(statusObject("重传上报次数2", "default", status));
        break;
      case "11": result.push(statusObject("重传上报次数3", "default", status));
        break;
    }
    return result;
  }
  ngOnInit() {
    this.getData();

  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
  //获取原数据加工
  getTableData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.httpService.api.getRDB).subscribe((res: any) => {
        const data = res.data;
        
        data.forEach((e, i) => {
          //处理设备状态 
          e.id = i + 1;
          e.equipStatus = this.handelEquipStatus(e.equipStatus);
          e.updateTime = dateFormat(String(e.updateTime));
          //处理报警状态
          e.dataAlarm = this.handelEquipAlarm(e.dataAlarm);

        })
        resolve(data);
      })
    })

  }
  //刷新数据
  getData() {
    this.getTableData().then(res => {
      this.data = res;
    })
  }

  //筛选数据
  filterData() {
    this.searchMode = true;

    this.getTableData().then(res => {
      let result = [];
      // console.log(this.q.equipId)
      if (this.q.equipId !== null && this.q.equipId.trim().length > 0) {
        result = res.filter((e, i1, arr) => {
          return e.equipId.toUpperCase().indexOf(this.q.equipId.trim().toUpperCase()) != -1;
        })
      }
      this.data = result;
    })

  }
  //重置按钮
  reset() {
    this.searchMode = false;
    // wait form reset updated finished
    this.getData()
    // setTimeout(() => this.getData());
  }



  // stChange(e: STChange) {
  //   switch (e.type) {
  //     case 'checkbox':
  //       this.selectedRows = e.checkbox!;
  //       this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
  //       // this.cdr.detectChanges();
  //       break;
  //     case 'filter':
  //       // this.getData();
  //       break;
  //   }
  // }

  // remove() {
  //   this.http.delete('/rule', { nos: this.selectedRows.map(i => i.no).join(',') }).subscribe(() => {
  //     // this.getData();
  //     this.st.clearCheck();
  //   });
  // }

  // approval() {
  //   this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
  // }

  // add(tpl: TemplateRef<{}>) {
  //   this.modalSrv.create({
  //     nzTitle: '新建规则',
  //     nzContent: tpl,
  //     nzOnOk: () => {
  //       this.loading = true;
  //       this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
  //     },
  //   });
  // }


}
