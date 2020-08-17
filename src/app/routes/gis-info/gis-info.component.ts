import { Component, OnInit } from '@angular/core';
// import format from 'date-fns/format';
import * as moment from 'moment';
const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const TOOLBOX = {
  show: true,
  feature: {
    // mark: {show: true},
    restore: { show: true },
    saveAsImage: { show: true }
  }
}

@Component({
  selector: 'app-gis-info',
  templateUrl: './gis-info.component.html',
  styleUrls: ['./gis-info.component.less']
})
export class GisInfoComponent implements OnInit {
  constructor() { }
  energyType: string = "0";
  date: Date;
  waterUserData: any = [];
  //模拟厂房用水量
  mock_factory_data = [
    {
      fid: 1,
      use: 185.23,
      leak: 5.23
    },
    {
      fid: 2,
      use: 123.23,
      leak: 1.23
    },
    {
      fid: 3,
      use: 124.23,
      leak: 5.23
    },
    {
      fid: 4,
      use: 36.23,
      leak: 5.23
    },
  ]
  option1 = {
    color: ["#1890ff"],
    tooltip: {
      trigger: 'axis',
      formatter: '{a}<br/>{b}: {c} 吨'
    },
    toolbox: TOOLBOX,
    grid: {
      tooltip: {
        show: true
      },
      left: "10%",
      top: "20%",
      right: "5%",
      bottom: "10%",
      // show: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      axisTick: {
        show: false
      },
      axisLabel: {
        color: "#aaa"
      },

      axisLine: {
        lineStyle: {
          color: "#aaa"
        }
      },

    },
    yAxis: {
      type: 'value',
      minInterval: 1000,
      axisLabel: {
        color: "#aaa"
      },
      axisLine: {
        // show: false,
        lineStyle: {
          color: "#aaa"
        }
      },
      axisTick: {
        show: false
      },
    },
    series: [{
      name: '用水量',
      data: [],
      type: 'line',
      smooth: false,
    }]
  };

  //生成用水趋势模拟量
  mock_WaterUserData() {

    const toDay = moment();
    let X = [];
    let Y = [];
    // console.log(toDay)
    // this.option1.series[0].data
    // new Array(30).forEach((e, i) => {
    //   this.option1.series[0].data.push
    // })

    for (let i = 0; i < 15; i++) {
      X.push(moment(toDay.subtract(1, 'days')).format('YYYY-MM-DD'));
      Y.push(r(1000, 4000))
    }
    this.option1.xAxis.data = X.reverse();
    this.option1.series[0].data = Y.reverse();
    this.option1 = { ...this.option1 }

  }
  ngOnInit() {
    const now = moment();
    this.waterUserData = Array(30).fill({}).map((e, i) => {
      return {
        // x: new Date(beginDay + 1000 * 60 * 60 * 24 * i),
        x: moment(now.subtract(1, 'days')).format('YYYY-MM-DD'),
        y: Math.floor(Math.random() * 100) + 10
      }
    });
    this.mock_WaterUserData();
  }
  onChange(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onOk(result: Date | Date[] | null): void {
    console.log('onOk', result);
  }
}
