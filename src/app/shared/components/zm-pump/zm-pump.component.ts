import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-zm-pump',
  templateUrl: './zm-pump.component.html',
  styleUrls: ['./zm-pump.component.less']
})
export class ZmPumpComponent implements OnInit {

  @Input() title: string;
  @Input() isHasParent: boolean;
  @Input() isHasChildren: boolean;
  constructor() { }

  ngOnInit() {
  }

}
