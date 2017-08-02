import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AjaxService} from '../../../core/services/ajax.service';
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {isNull} from "util";
import {ActivatedRoute} from "@angular/router";
import {Router} from '@angular/router';
const swal = require('sweetalert');
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  public sysList;
  public sysNamea;
  public orgList;
  public sysCode;
  public orgCode;

  //初始化角色管理的title
  public roleGroupName:string="角色管理";
  public roleGroupCode;

  private data: Page = new Page();
  private buttonConfig;
  private buttonConfig1;

  constructor(private ajax: AjaxService, private routeInfo: ActivatedRoute, private router: Router) {
  }
  //初始化的时候获取系统列表的接口和机构的接口
  ngOnInit() {
    //系统列表的接口，以及设置初始化的sysCode，然后根据sysCode调用初始化的角色组列表和角色列表
    this.ajax.get({
      url: '/sys/list',
      data: {
        'sysName': ''
      },
      success: (data) => {
        this.sysCode = data[0].sysCode;
        this.sysList = data;
        this.sysNamea=data[0].sysName;
        console.log(this.sysNamea)
        this.queryDatas();
      },
      error: (data) => {
        console.log("error");
      }
    });
    //机构列表的接口
    this.ajax.get({
      url: '/organ/list',
      data: {
        orgName:''
      },
      success: (data) => {
        this.orgList = data;
        console.log(data)
      },
      error: (data) => {
        console.log("/organ/list    error");
      }
    });
    //添加按钮配置
    this.buttonConfig = [
      {
        title: "绑定角色",
        type: "add",
        size:'xs',
        callback: function (result) {
          result.then(() => {
            // alert("绑定角色成功");
          })
        }
      }
    ];
    //修改按钮配置
    this.buttonConfig1 = [
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
  //系统发生变化的时候再次调用，改变角色组和角色的列表
  onSelectSys(sys): void {
    this.sysCode = sys.value;
    this.queryDatas();
  }
  //角色组列表分页
  public queryDatas(event?: PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    this.ajax.get({
      url: "/roleGroup/listpage",
      data: {
        curPage: activePage,
        sysCode: this.sysCode,
        pageSize:6
      },
      success: (data) => {
        if (!isNull(data)) {
          me.data = new Page(data);

        }
      },
      error: (data) => {
        console.log('角色组列表分页错误');
      }
    });
  }
  //这个事件两个作用 1，改变角色的title 2 根据系统的编码查询角色列表
  selectRole(roleGroupCode,roleGroupName){
    this.roleGroupName=roleGroupName;
    this.roleGroupCode=roleGroupCode;
  }
  //修改角色组的状态
  updateRoleGroupState(data){
    if(data.isUse=="Y"){
      data.isUse="N"
    }else if(data.isUse=="N"){
      data.isUse="Y"
    }
    this.ajax.post({
      url: '/roleGroup/updateState',
      data: {
        'roleGroupCode': data.roleGroupCode,
        'isUse': data.isUse
      },
      success: (data) => {
        swal('成功提醒', '成功，状态：success', 'success');
      },
      error: (data) => {
        console.log("修改角色组的状态失败");
      }
    });
  }
}

