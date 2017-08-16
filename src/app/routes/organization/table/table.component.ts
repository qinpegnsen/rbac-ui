import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {

  @Input() orgEmpExtVOList: Array<any>;
  check_status = [];
  top_check = false;
  constructor() { }

  ngOnInit() {
    // 初始化数组
    this.orgEmpExtVOList.map((value, index, array) => {this.check_status[index] = false});
  }

  // 实现  全选  反选  不全选 等
  toggle(top: boolean) {
    if (top) {
      this.top_check = !this.top_check;
      for (let i = 0; i < this.check_status.length; i ++) {
        this.check_status[i] = this.top_check;
      }
    }
    this.top_check = this.check_status.every((item) => {
      return item == true;
    });
  }

}
