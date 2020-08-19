import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { STColumn } from '@delon/abc';
import { getTimeDistance, deepCopy } from '@delon/util';
import { _HttpClient } from '@delon/theme';
import { I18NService } from '@core';
import * as moment from 'moment';
// import { yuan } from '@shared';
const r = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)
@Component({
  selector: 'app-dashboard-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private i18n: I18NService,
    private cdr: ChangeDetectorRef,
  ) { }
  public alarmData = [];
  data: any = {};
  loading = true;
  date_range: Date[] = [];
  rankingListData: any[] = Array(7)
    .fill({})
    .map((item, i) => {
      return {
        title: `${i + 1}号楼`,
        total: 323234,
      };
    });
  titleMap = {
    y1: this.i18n.fanyi('app.analysis.traffic'),
    y2: this.i18n.fanyi('app.analysis.payments'),
  };
  searchColumn: STColumn[] = [
    { title: '排名', i18n: 'app.analysis.table.rank', index: 'index' },
    {
      title: '搜索关键词',
      i18n: 'app.analysis.table.search-keyword',
      index: 'keyword',
      click: (item: any) => this.msg.success(item.keyword),
    },
    {
      type: 'number',
      title: '用户数',
      i18n: 'app.analysis.table.users',
      index: 'count',
      sorter: (a, b) => a.count - b.count,
    },
    {
      type: 'number',
      title: '周涨幅',
      i18n: 'app.analysis.table.weekly-range',
      index: 'range',
      render: 'range',
      sorter: (a, b) => a.range - b.range,
    },
  ];

  salesType = 'all';
  salesPieData: any;
  salesTotal = 0;

  saleTabs: any[] = [{ key: '园区用水量', show: true }];

  offlineIdx = 0;
  //生成随机报警
  mock_alarmData() {
    // console.log("生成随机报警")
    const status = [
      "连接异常",
      "通讯异常",
      "压力异常",
      "温度异常",
      "电力异常"
    ]
    this.alarmData = Array(r(5, 20)).fill({}).map((e, i) => {
      return {
        isAlarm: r(0, 2) - 1,
        deviceName: '设备' + i + 1,
        status: status[r(0, 5) - 1],
        dateTime: moment().subtract(1 + 1 * i, 'minute').format('YYYY-MM-DD hh:mm:ss')
      }
    }).sort((a, b) => a.isAlarm)
  }
  ngOnInit() {
    this.http.get('/chart').subscribe((res: any) => {
      res.offlineData.forEach((item: any, idx: number) => {
        item.show = idx === 0;
        item.chart = deepCopy(res.offlineChartData);
      });
      this.data = res;
      this.loading = false;
      this.changeSaleType();
    });
    this.mock_alarmData()
  }

  setDate(type: any) {
    this.date_range = getTimeDistance(type);
    setTimeout(() => this.cdr.detectChanges());
  }
  changeSaleType() {
    this.salesPieData =
      this.salesType === 'all'
        ? this.data.salesTypeData
        : this.salesType === 'online'
          ? this.data.salesTypeDataOnline
          : this.data.salesTypeDataOffline;
    if (this.salesPieData) {
      this.salesTotal = this.salesPieData.reduce((pre, now) => now.y + pre, 0);
    }
    this.cdr.detectChanges();
    this.date_range = getTimeDistance(this.salesType == "all" ? "year" : "-month");
    setTimeout(() => this.cdr.detectChanges());
  }

  handlePieValueFormat(value: any) {
    return (value);
  }
  salesChange(idx: number) {
    if (this.saleTabs[idx].show !== true) {
      this.saleTabs[idx].show = true;
      this.cdr.detectChanges();
    }
  }
  offlineChange(idx: number) {
    if (this.data.offlineData[idx].show !== true) {
      this.data.offlineData[idx].show = true;
      this.cdr.detectChanges();
    }
  }
}
