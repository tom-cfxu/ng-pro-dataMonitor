import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { G2TimelineData } from '@delon/chart';
import { STColumn, STPage } from '@delon/abc';
import { getTimeDistance } from '@delon/util';
//随机数
let timer;
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
  selector: 'app-leakage-analysis',
  templateUrl: './leakage-analysis.component.html',
  styleUrls: ['./leakage-analysis.component.less']
})
export class LeakageAnalysisComponent implements OnInit {
  //表格数据
  realtimeData: any[] = [];
  //表格配置
  columns: STColumn[] = [
    {
      title: '',
      index: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      // width: 10,
    },
    {
      title: '设备所属',
      index: 'bid',
      // sort: { compare: (a, b) => a.bid - b.bid },
      // width: 60,
    },
    {
      title: '设备编号',
      index: 'eid',
      // sort: { compare: (a, b) => a.eid - b.eid },
      // width: 60,
    },
    {
      title: '用水量 (m³)',
      index: 'water',
      sorter: (a: any, b: any) => a.water - b.water,
      // width: 60,
    },
    {
      title: '漏损量 (m³)',
      index: 'leak',
      sorter: (a: any, b: any) => a.leak - b.leak,
      // width: 60,
    },
    {
      title: '漏损率',
      index: 'leakRate',
      render: 'custom',
      sorter: (a: any, b: any) => a.leakRate - b.leakRate,
      // tag: TAG
      // width: 60,
    },
  ];
  //表格加载
  tableToading: boolean = false;
  //表格分页配置
  page: STPage = {
    front: true,
    pageSizes: [10, 15, 20, 30, 40, 50, 60, 100, 120],
    showSize: true,
    showQuickJumper: true,
    total: true,
    position: "bottom",
    placement: "center"
  };
  //日期选择器值
  dateValue: any = "month";
  //日期选择器
  date_range: Date[] = [];
  //用水量
  option1: any;
  option2: any;
  option3: any;
  option4: any;
  //实时趋势
  chartData: G2TimelineData[] = [];
  echartsIntance: any;
  //按日期查找数据按钮
  search() {
    let start = this.date_range[0];
    let end = this.date_range[1];
    let diff = end.getTime() - start.getTime();
    const d = Math.floor(diff / 1000 / 60 / 60 / 24) + 1;
    this.randomDate(r(0, 200), d * 200, d * 40);
  }
  //实时趋势事件
  handleClick(e) {
    console.log(e);
  }

  //图表初始化
  chartInit() {
    //漏损率仪表盘
    this.option1 = {
      backgroundColor: '#fff',
      tooltip: {
        formatter: '{a} <br/>{c}%'
      },
      grid: {
        left: "5%",
        top: "5%",
        bottom: "5%",
        right: "5%"
      },
      toolbox: TOOLBOX,
      series: [
        {
          name: '漏损率(%)',
          type: 'gauge',
          min: 0,
          max: 100,
          // splitNumber: 11,
          radius: '100%',
          color1: [[0.2, '#13c2c2'], [0.8, '#58afff'], [1, '#f47e92']],
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              color: [[0.2, '#13c2c2'], [0.8, '#58afff'], [1, '#f47e92']],
              width: 5,
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          axisLabel: {            // 坐标轴小标记
            fontWeight: 'bolder',
            color: '#333',
            shadowColor: '#fff', //默认透明
            shadowBlur: 10
          },
          axisTick: {            // 坐标轴小标记
            length: 15,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          splitLine: {           // 分隔线
            length: 25,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              width: 1,
              color: "[[0.2, '#13c2c2'], [0.8, '#58afff'], [1, '#f94141']]",
              shadowColor: '#fff', //默认透明
              shadowBlur: 10,
              z: 1
            }
          },
          pointer: {           // 分隔线
            shadowColor: '#fff', //默认透明
            shadowBlur: 5
          },
          title: {
            show: false,
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 20,
              // fontStyle: 'italic',
              color: '#333',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          detail: {
            backgroundColor: '#58afff',
            borderWidth: 0,
            // borderColor: '#fff',
            borderRadius: 4,
            shadowColor: '#fff', //默认透明
            shadowBlur: 5,
            lineHeight: 30,
            fontSize: 30,
            formatter: (value) => value.toFixed(0) + "%",
            // offsetCenter: [0, '55%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff'
            }
          },
          data: [{ value: 40, name: "漏损率(%)" }]
        },
      ]
    };
    //用水漏水量饼图
    this.option2 = {
      color: ['#ff5500', '#58afff'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}吨 ({d}%)',
      },
      toolbox: TOOLBOX,
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['漏水量', '用水量'],
      },
      series: [
        {
          name: '用水漏水量',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '80%'],
          label: {
            position: 'inner',
            formatter: '{b}\n\n{d}%',
            fontSize: 15,
            borderWidth: 0
          },
          labelLine: {
            show: true
          },

          data: [
            { value: 1, name: '漏水量', selected: true },
            { value: 8, name: '用水量' },
          ]
        },
      ]
    };
    //用水统计
    this.option3 = {
      color: ["#8ccfec", "#facd91"],
      tooltip: {
        trigger: 'axis',
        formatter: '{a}<br/>{b}: {c} 吨'
      },
      toolbox: TOOLBOX,
      grid: {
        tooltip: {
          show: true
        },
        left: "15%",
        top: "15%",
        right: "5%",
        bottom: "10%",
        // show: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['05月', '06月', '07月'],
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
        data: [820, 932, 901,],
        type: 'line',
        smooth: true,
        areaStyle: {}
      }]
    };
    //漏损统计
    this.option4 = {
      color: ["#facd91"],
      tooltip: {
        trigger: 'axis',
        formatter: '{a}<br/>{b}: {c} 吨'
      },
      grid: {
        tooltip: {
          show: true
        },
        left: "15%",
        top: "15%",
        right: "5%",
        bottom: "10%",
        // show: true
      },
      toolbox: TOOLBOX,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['05月', '06月', '07月'],
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
        name: '漏损量',
        data: [120, 200, 100,],
        type: 'line',
        smooth: true,
        areaStyle: {}
      }]
    }
  }
  //设置日期事件
  setDate() {
    // console.log(this.dateValue);
    this.date_range = getTimeDistance(this.dateValue);
    setTimeout(() => this.cdr.detectChanges());
    switch (this.dateValue) {
      case "today":
        this.randomDate(r(6, 10), 200, 40);
        break;
      case "week":
        this.randomDate(r(30, 40), 1600, 300);
        break;
      case "month":
        this.randomDate(r(120, 130), 6500, 1400);
        break;
      case "year":
        this.randomDate(r(1400, 1500), 72000, 18000);
        break;
    }
    // this.randomDate(50)
  }
  //随机数据
  randomDate(num: number, water: number, leak: number) {
    this.tableToading = true;
    setTimeout(() => {
      this.tableToading = false;
      this.realtimeData = Array(num).fill({}).map((_item: any, idx: number) => {
        return {
          id: idx + 1,
          bid: `${Math.floor(Math.random() * 3 + 1)}号楼`,
          eid: `LXSXY${r(1, 15)}-0${r(1, 3)}`,
          water: `${r(water, water + 500).toFixed(2)}`,
          leak: `${r(0, leak).toFixed(2)}`,
          // leakRate: (leak/water),
        }
      })
      this.realtimeData.forEach(e => {
        e.leakRate = ((e.leak / e.water) * 100).toFixed(1);
        e.leakRateColor = e.leakRate > 15 ? "#f50" : (e.leakRate > 10 ? "#f59a23" : "#87d068")
      })
    }, 500)
  }
  constructor(
    private cdr: ChangeDetectorRef,
  ) { }
  //表格点击
  _stClick(e) {
    if (e.type == "click") {
      // console.log(e.click.item);
      var { water, leak, leakRate } = e.click.item;
      this.setOption("option1", leakRate);
      this.setOption("option2", { leak, water });
    }
  }

  setOption(optionName: string, data: any) {
    switch (optionName) {
      case "option1":
        this.option1.series[0].data = [{ value: data, name: "漏损率(%)" }];
        this.option1 = { ...this.option1 };
        break;
      case "option2":
        this.option2.series[0].data = [
          { value: data.leak, name: '漏水量', selected: true },
          { value: data.water, name: '用水量' },
        ];
        this.option2 = { ...this.option2 };
        break;
    }
  }
  ngOnInit() {
    this.chartInit();
    this.randomDate(120, 6500, 1400)
    this.chartData = Array(10).fill({}).map((data: any, i: number) => {
      return {
        x: new Date().getTime() - 2000 * i,
        y1: Math.floor(Math.random() * 100) + 1000,
        y2: Math.floor(Math.random() * 100) + 10,
      }
    }).sort((a, b) => b.x - a.x);
    //定时生成数据
    timer = setInterval(() => {
      //漏损率
      this.chartData.shift();
      this.chartData.push({
        x: new Date().getTime(),
        y1: Math.floor(Math.random() * 100) + 1000,
        y2: Math.floor(Math.random() * 100) + 10,
      })
      this.chartData = [...this.chartData];
    }, 2000)

  }
  ngDestory() {
    clearInterval(timer)
  }

}
