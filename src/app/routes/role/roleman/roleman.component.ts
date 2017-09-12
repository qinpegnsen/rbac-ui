import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {isNull} from "util";
import {Page} from "../../../core/page/page";

import {AjaxService} from '../../../core/services/ajax.service';
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
const swal = require('sweetalert');
@Component({
  selector: 'app-roleman',
  templateUrl: './roleman.component.html',
  styleUrls: ['./roleman.component.scss']
})
export class RolemanComponent implements OnInit,OnChanges {

  //定义分页用的数据data
  public data: Page = new Page();

  /**
   * 2个button的按钮
   * disAuthButton 分配权限按钮
   * updateButton  修改按钮
   */
  private disAuthButton;
  private updateButton;

  /**
   * 获取到传递过来的系统编码，获取当前系统下的所有角色
   */
  @Input()
  public sysCode;

  /**
   * 下面的这两个输入属性是角色组传过来的
   * roleGroupCode 角色组的编码
   * roleGroupName 角色组的名字如果没有的话默认是当前系统下的所有角色
   */
  @Input()
  public roleGroupCode;
  @Input()
  public roleGroupName;
  public roleGroupNameText;

  /**
   * 获取到传递过来的地址栏的类型，在传给神龙，从而加载刷新不同的页面
   */
  @Input()
  public addrType;
  constructor(private ajax: AjaxService) {

  }
  ngOnInit() {
    //分配权限按钮
    this.disAuthButton = [
      {
        text:"",
        title:"分配权限",
        type: "add",
        size:"xs",
        callback:function(result){
          result.then((id)=>{
            // alert(id);
          })
        }
      },
    ];
    //修改按钮
    this.updateButton = [
      {
        title: "修改",
        type: "update",
        size:'xs',
        callback: function (result) {
          result.then(() => {
            // alert("绑定角色成功");
          })
        }
      }
    ];

  }
  /**
   *
   * @param changes 当有输入属性的时候会执行这个钩子
   * sysCode 输入属性变化
   * roleGroupCode 角色组输入属性变化
   */
  ngOnChanges(changes: SimpleChanges): void {
  //当sysCode变化的时候再次调动
  if(changes["sysCode"] && this.sysCode){
    this.roleGroupNameText="当前系统下的所有角色"
    this.queryRoleListDatasBySyscode()
  }
  //当roleGroupCode变化的时候再次调动
  if(changes["roleGroupCode"] && this.roleGroupCode){
    this.roleGroupNameText="【"+this.roleGroupName+"】角色组下面的所有角色"
    this.queryRoleListDatasByroleGroupCode()
  }
}

  /**
   * 点击页码时执行的事件
   * @param event
   * 1.当前系统下角色列表的页码
   * 2.当前角色组下面的色列表页码
   */
  queryRoleList(event){
    if(this.sysCode){
      this.queryRoleListDatasBySyscode(event)
    }else if(this.roleGroupCode){
      this.queryRoleListDatasByroleGroupCode(event)
    }
  }

  //根据系统编码变化的角色列表
  public queryRoleListDatasBySyscode(event?: PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    this.ajax.get({
      url: "/role/listpage",
      data: {
        curPage: activePage,
        sysCode: this.sysCode,
        pageSize:8
      },
      success: (data) => {
        if (!isNull(data)) {
          me.data = new Page(data);
        }
      },
      error: (data) => {
        console.log("根据系统编码查询角色错误");
      }
    })
  }

  //根据角色组编码变化的角色列表
  public queryRoleListDatasByroleGroupCode(event?: PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    this.ajax.get({
      url: "/role/getRoleListPageByRoleGroupCode",
      data: {
        curPage: activePage,
        roleGroupCode: this.roleGroupCode,
        pageSize:8
      },
      success: (data) => {
        if (!isNull(data)) {
          me.data = new Page(data);
        }
      },
      error: (data) => {
        console.log("根据角色组编码查询错误");
      }
    });
  }

  //修改角色的状态
  updateRoleState(data){
    if(data.isUse=="Y"){
      data.isUse="N"
    }else if(data.isUse=="N"){
      data.isUse="Y"
    }
    this.ajax.post({
      url: '/role/updateState',
      data: {
        'roleCode': data.roleCode,
        'isUse': data.isUse
      },
      success: () => {
        let text='';
        if(data.isUse=="N"){
          text="停用成功"
        }else if(data.isUse=="Y"){
          text="启用成功"
        }
        swal(text,'','success');
      },
      error: (data) => {
        swal('停启用连接数据库失败','','error');

      }
    });
  }
}
