import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { STColumn } from '@delon/abc';
import { getTimeDistance, deepCopy } from '@delon/util';
import { _HttpClient } from '@delon/theme';
import { I18NService } from '@core';
import * as moment from 'moment';
import * as Mock from 'mockjs';
import { format } from 'date-fns';

// region: mock data

const visitData: any[] = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: format(new Date(beginDay + 1000 * 60 * 60 * 24 * i), 'YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const visitData2: any[] = [];
const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: format(new Date(beginDay + 1000 * 60 * 60 * 24 * i), 'YYYY-MM-DD'),
    y: fakeY2[i],
  });
}

const salesData: any[] = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}
const searchData: any[] = [];
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  });
}
const salesTypeData = [
  {
    x: '一号楼',
    y: 500,
  },
  {
    x: '二号楼',
    y: 456,
  },
  {
    x: '三号楼',
    y: 356,
  },
  {
    x: '四号楼',
    y: 234,
  },
  {
    x: '五号楼',
    y: 121,
  },
  {
    x: '六号楼',
    y: 120,
  },
];

const salesTypeDataOnline = [
  {
    x: '一号楼',
    y: 244,
  },
  {
    x: '二号楼',
    y: 321,
  },
  {
    x: '三号楼',
    y: 311,
  },
  {
    x: '四号楼',
    y: 41,
  },
  {
    x: '五号楼',
    y: 121,
  },
  {
    x: '六号楼',
    y: 111,
  },
];

const salesTypeDataOffline = [
  {
    x: '家用电器',
    y: 99,
  },
  {
    x: '个护健康',
    y: 188,
  },
  {
    x: '服饰箱包',
    y: 344,
  },
  {
    x: '母婴产品',
    y: 255,
  },
  {
    x: '其他',
    y: 65,
  },
];

const offlineData: any[] = [];
for (let i = 0; i < 10; i += 1) {
  offlineData.push({
    name: `${i}号楼`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  });
}
const offlineChartData: any[] = [];
for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: new Date().getTime() + 1000 * 60 * 30 * i,
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
  });
}

const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];

//
const radarData: any[] = [];
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度',
};
radarOriginData.forEach(item => {
  Object.keys(item).forEach(key => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      });
    }
  });
});
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
  data: any = {
    visitData,
    visitData2,
    salesData,
    searchData,
    offlineData,
    offlineChartData,
    salesTypeData,
    salesTypeDataOnline,
    salesTypeDataOffline,
    radarData,
  };
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
    // this.http.get('/chart').subscribe((res: any) => {
    this.data.offlineData.forEach((item: any, idx: number) => {
      item.show = idx === 0;
      item.chart = deepCopy(this.data.offlineChartData);
    });
    //   this.data = res;
    //   console.log(this.data);
    this.loading = false;
    this.changeSaleType();
    // });
    console.log(this.data);
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
