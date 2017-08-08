import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {RolemanComponent} from "../roleman/roleman.component";
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  public sysList;
  public sysName;
  public sysCode;
  private addButton;

  //获取子组件RolemanComponent的实例，才可以调用它的方法
  @ViewChild(RolemanComponent)
  rolemanComponent: RolemanComponent;
  constructor(private ajax: AjaxService) {
  }

  ngOnInit() {
    this.addButton = {
      type: "add",
      text: "新增角色",
      title: '新增角色'
    };
    //系统列表的接口，以及设置初始化的sysCode，然后根据sysCode调用初始化的角色列表
    this.ajax.get({
      url: '/sys/list',
      data: {
        'sysName': ''
      },
      success: (data) => {
        this.sysCode = data[0].sysCode;
        this.sysList = data;
        this.sysName = data[0].sysName;
      },
      error: (data) => {
        console.log("sys/list  error");
      }
    });
  }

  onSelectSys(sys): void {
    this.sysCode = sys.value;
  }
  /**
   * 刷新角色列表
   */
  refresh() {
    this.rolemanComponent.queryRoleListDatasBySyscode();
  }


}
