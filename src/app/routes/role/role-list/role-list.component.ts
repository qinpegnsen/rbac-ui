import {Component, OnInit, ViewChild} from '@angular/core';
import {RolemanComponent} from "../roleman/roleman.component";
import {ActivatedRoute} from "@angular/router";
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  public sysList;
  public sysName="请先选择系统";
  public sysCode;
  private addButton;
  @ViewChild(RolemanComponent)
  rolemanComponent: RolemanComponent;          //获取子组件RolemanComponent的实例，才可以调用它的方法
  public addrType;                            //获取地址的类型，为了加载不同的页面使用的,传递到神龙页面

  constructor( private routeInfo: ActivatedRoute) {
  }

  /**
   * 1.对按钮进行赋值
   * 2.获取路由的参数
   */
  ngOnInit() {
    this.addButton = {                     //增加的按钮
      type: "add",
      text: "新增角色",
      title: '新增角色'
    };

    let data=JSON.parse(localStorage.getItem('sysListData'));
    this.sysCode = data[0].sysCode;
    this.sysName = data[0].sysName;
    this.sysList = data;

    this.addrType = this.routeInfo.snapshot.data[0]["type"];     //获取到路由传递过来的类型，从而在神龙的提交的时候加载刷新不同的页面
  }

  /**
   * 系统变化执行的方法
   * @param sysCode
   * @param sysName
   */
  onSelectSys(sysCode,sysName): void {
    this.sysCode = sysCode;
    this.sysName = sysName;
  }

  /**
   * 刷新角色列表
   */
  refresh() {
    this.rolemanComponent.queryRoleListDatasBySyscode();
  }


}
