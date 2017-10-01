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

  public data: Page = new Page();                //定义分页用的数据data
  private disAuthButton;                         //分配权限按钮
  private updateButton;                          //修改按钮
  @Input()
  public sysCode;                                //输入属性，系统编码
  @Input()
  public roleGroupCode;                          //输入属性，角色组的编码
  @Input()
  public roleGroupName;                          //输入属性，角色组的名字如果没有的话默认是当前系统下的所有角色
  public roleGroupNameText;                      //输入属性，角色组的文本
  @Input()
  public addrType;                               //输入属性
  public showBindComp:boolean = false;

  constructor(private ajax: AjaxService) {

  }

  /**
   * 对按钮进行赋值
   */
  ngOnInit() {
    let me = this;
     this.disAuthButton = [
      {
        text:"",
        title:"分配权限",
        type: "add",
        size:"xs",
        callback:function(result){
          result.then((id)=>{
            me.showBindComp = !me.showBindComp;
            // alert(id);
          })
        }
      },
    ]; //分配权限按钮
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
    ]; //修改按钮

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
  if(changes["roleGroupCode"]&& this.roleGroupCode){
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


  /**
   * 根据系统编码变化的角色列表
   * @param event
   */
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


  /**
   * 根据角色组编码变化的角色列表
   * @param event
   */
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


  /**
   * 修改角色的状态
   * @param data
   */
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
