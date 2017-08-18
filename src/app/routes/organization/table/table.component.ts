import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  check_status = [];
  top_check = false;
  private _orgEmpExtVOList:Array<any>;
  private buttonConfig;
  private tableButtonConfig:Array<object>;



  @Input() set orgEmpExtVOList(value:any) {
    if (!this._orgEmpExtVOList && value) {
      console.log(1);
      value.map((value, index, array) => {this.check_status[index] = false});
    }
    this._orgEmpExtVOList = value;
  }
  get orgEmpExtVOList() {
    return this._orgEmpExtVOList;
  }
  constructor() {
    this.buttonConfig = [
      {
        title: "绑定角色角色组",
        type: "add",
        size: 'xs',
      }
    ];
    this.tableButtonConfig = [
      {
        title: "修改员工",
        type: "update",
        size: 'xs',
      }
    ];

  }

  ngOnInit() {
    // 初始化数组
    //this.orgEmpExtVOList.map((value, index, array) => {this.check_status[index] = false});
  }

  // 实现  全选  反选  不全选 等
  toggle(top:boolean) {
    if (top) {
      this.top_check = !this.top_check;
      for (let i = 0; i < this.check_status.length; i++) {
        this.check_status[i] = this.top_check;
      }
    }
    this.top_check = this.check_status.every((item) => {
      return item == true;
    });
  }

}
