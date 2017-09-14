import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {AjaxService} from "../../../core/services/ajax.service";
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {isNull} from "util";
import {ActivatedRoute} from "@angular/router";
import {RolemanComponent} from "../roleman/roleman.component";
import {RoleService} from "./role.service";
const swal = require('sweetalert');
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})

export class RoleComponent implements OnInit {
  public sysList;                           //初始化系统的编码，默认第一个，然后根据sysCode调用初始化的角色组列表和角色列表
  public sysCode;                           //系统列表的数据
  public sysName;                           //系统下拉框里面的默认的文本
  private addGroupButton;                   //添加角色组的按钮
  private bingRoleButton;                   //绑定角色按钮
  private updateButton;                     //修改按钮
  public roleGroupName;                     //角色组的名字
  public roleGroupCode;                     //角色组的编码
  private data: Page = new Page();          //分页用到得data
  @Output()
  getRoleGroupPageInfo = new EventEmitter();   //把当前的页码信息发射出去，刷新的时候用到
  @ViewChild(RolemanComponent)
  rolemanComponent: RolemanComponent;         //获取子组件RolemanComponent的实例，才可以调用它的方法,局部刷新用的
  public addrType;                           //获取地址的类型，为了加载不同的页面使用的,传递到神龙页面

  constructor(private ajax: AjaxService, private routeInfo: ActivatedRoute) {
  }

  /**
   *
   * 1.调用系统列表的接口
   * 2.调用机构的接口
   * 3.对按钮进行赋值
   */
  ngOnInit() {
    let data = JSON.parse(localStorage.getItem('sysListData'));
    this.sysCode = data[0].sysCode;
    this.sysName = data[0].sysName;
    this.sysList = data;
    this.queryRoleGroupDatas();

    this.addGroupButton = {
      type: "add",
      text: "新增角色组",
      title: '新增角色组'
    };//添加角色组的按钮
    this.bingRoleButton = [
      {
        title: "绑定角色",
        type: "add",
        size: 'xs',
        callback: function (result) {
          result.then(() => {
            // alert("绑定角色成功");
          })
        }
      }
    ]; //绑定角色按钮
    this.updateButton = [
      {
        title: "修改",
        type: "update",
        size: 'xs',
        callback: function (result) {
          result.then(() => {
            // alert("绑定角色成功");
          })
        }
      }
    ];  //修改按钮配置

    this.addrType = this.routeInfo.snapshot.data[0]["type"];//获取到路由传递过来的类型，从而在神龙的提交的时候加载刷新不同的页面

  }

  /**
   * 系统发生变化的时候，获取到当前的系统编码，然后在刷新列表
   * @param sysCode
   * @param sysName
   */
  onSelectSys(sysCode, sysName): void {
    this.sysCode = sysCode;
    this.sysName = sysName;
    this.queryRoleGroupDatas();
  }

  /**
   * 角色组列表分页,点击分页的时候执行的事件
   * @param event
   *  把当前的页码信息发射出去，刷新用的
   */
  public queryRoleGroupDatas(event?: PageEvent) {
    this.getRoleGroupPageInfo.emit(event);//把当前的页码信息发射出去，刷新用的
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    this.ajax.get({
      url: "/roleGroup/listpage",
      data: {
        curPage: activePage,
        sysCode: this.sysCode,
        pageSize: 8
      },
      success: (data) => {
        if (!isNull(data)) {
          me.data = new Page(data);
        }
      },
      error: () => {
        console.log('角色组列表分页错误');
      }
    });
  }

  /**
   * 角色组列表的点击事件
   * @param roleGroupCode 角色组的编码
   * @param roleGroupName 角色组的名字
   */
  selectRole(roleGroupCode, roleGroupName) {
    this.roleGroupName = roleGroupName;
    this.roleGroupCode = roleGroupCode;
  }

  /**
   * 修改角色组的状态
   * @param data 当前获取到得数据
   */
  updateRoleGroupState(data) {
    if (data.isUse == "Y") {
      data.isUse = "N"
    } else if (data.isUse == "N") {
      data.isUse = "Y"
    }
    this.ajax.post({
      url: '/roleGroup/updateState',
      data: {
        'roleGroupCode': data.roleGroupCode,
        'isUse': data.isUse
      },
      success: () => {
        let text = '';
        if (data.isUse == "N") {
          text = "停用成功"
        } else if (data.isUse == "Y") {
          text = "启用成功"
        }
        swal(text, '', 'success');
      },
      error: () => {
        swal('停启用连接数据库失败', '', 'error');
      }
    });
  }

  /**
   * 执行刷新的方法
   */
  refresh() {
    this.rolemanComponent.queryRoleListDatasByroleGroupCode();
    this.queryRoleGroupDatas()
  }
}

