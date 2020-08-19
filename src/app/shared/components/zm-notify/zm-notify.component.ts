import { Component, OnInit, Input } from '@angular/core';

interface dataType {
  isAlarm: boolean;
  deviceName: string;
  status: string;
  dateTime: string;
}

@Component({
  selector: 'app-zm-notify',
  templateUrl: './zm-notify.component.html',
  styleUrls: ['./zm-notify.component.less']
})
export class ZmNotifyComponent implements OnInit {

  @Input() data: Array<object>;
  constructor() { }

  ngOnInit() {
  }

}
