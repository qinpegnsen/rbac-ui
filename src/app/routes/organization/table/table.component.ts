import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AppStore} from "../store/app-store";
import {Store} from "@ngrx/store";
import {AjaxService} from "../../../core/services/ajax.service";
import {OrgService} from "../server/org.service";

const swal = require('sweetalert');
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  check_status = []; // 处理全选 不选 等的状态数组
  top_check = false;
  private _orgEmpExtVOList:Array<any>;
  private buttonConfig;
  private tableButtonConfig:Array<object>;
  private arr = [];
  private srrStaff;


  @Input() set orgEmpExtVOList(value:Array<any>) {
    if (value) {
      console.log(value);
      this.check_status = [];
      this.top_check = false;
      value.map((value, index, array) => {this.check_status[index] = false});
    }
    this._orgEmpExtVOList = value;
    console.log(this._orgEmpExtVOList)
  }
  get orgEmpExtVOList() {
    return this._orgEmpExtVOList;
  }
  constructor(
    private ajax:AjaxService,
    private store: Store<AppStore>,
    private org:OrgService
  ) {
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
    this.store.select('query').subscribe((res) => {
      console.log(res);
      this.top_check = res as boolean;
      this.toggle();
    });
  }

  /**
   * 实现  全选  反选  不全选 等
   * @param top
     */
  toggle(top?:boolean) {
    if (top) {
      this.top_check = !this.top_check;
      for (let i = 0; i < this.check_status.length; i++) {
        this.check_status[i] = this.top_check;
      }
    }
    if (!this.check_status.length) {
        return ;
    }
    this.top_check = this.check_status.every((item) => {
      return item === true;
    });
  }


  /**
   * 保存员工编码
   * @param staffCode
     */
  delstaff(event){
    console.log(event);
    console.log(event.check_status);
    console.log(event._orgEmpExtVOList);
    this.arr.length=0;
    var checkStatus = event.check_status;
    var objs = event._orgEmpExtVOList;

    for(var i=0;i<checkStatus.length;i++){
        if(checkStatus[i]){
          this.arr.push(objs[i].staffCode);
        }
    }
    //this.arr.push(staffCode);
    this.srrStaff=this.arr.join(',');
    console.log(this.arr);
  }

  /**
   * 删除员工
   */
  delstaffs(){
    this.ajax.post({
      url: '/staff/updateState',
      data: {
        'staffCode':this.srrStaff,
        'state': 'DEL'
      },
      success: () => {
        this.store.select('addStaff').subscribe((res) => {
          this.org.getOrgList('/staff/list?deptCode=' + res[0].deptCode).subscribe((res) => {
            this.store.dispatch({type: 'STAFF_ADD', payload: res});
          })
        });
          swal('删除成功', '', 'success');

      },
      error: (data) => {
        swal('删除失败提醒', '', 'error');
      }
    });
  }


  upMenudateState(data) {
    if (data.isHead == "N") {
      data.isHead = "Y"
    } else if (data.isHead == "Y") {
      data.isHead = "N"
    }
    this.ajax.post({
      url: '/staff/updateIsHead',
      data: {
        'staffCodes': data.staffCode,
        'deptCode':data.deptCode,
        'isHead':data.isHead
      },
      success: () => {
        if (data.isHead == "Y") {
          swal('设置主管取消', '', 'success');
        } else if (data.isHead == "N") {
          swal('设置主管成功', '', 'success');
        }
      },
      error: (data) => {
        swal('为部门设置主管失败', '', 'error');
      }
    });
  }
}
