import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import { StartupService } from '@core/startup/startup.service';
import { WeekdayPipe } from '../../pipe/weekday.pipe';
let timer;
@Component({
  selector: 'layout-pro-time',
  templateUrl: './time.component.html',
  styles: [`
    .time{
      display:flex;
      justify-content:space-around;
      algin-item:center
    }
    p{
      margin:0;
      padding:0;
      line-height:100%;
       color:#595959;
    }
    .date-time{
      font-size:24px;
      font-weight:bold;
     
    }
  `]
})
export class LayoutProTimeComponent implements OnInit {
  time: any;
  day: any;
  YMD: any;
  constructor() { }
  ngOnInit() {
    this.time = moment().format("HH:mm:ss");
    this.day = moment().format("dddd");
    this.YMD = moment().format("YYYY年MM月DD日");
    timer = setInterval(() => {
      this.time = moment().format("HH:mm:ss");
    }, 1000)
  }
  ngDestory() {
    clearInterval(timer);
  }
}
