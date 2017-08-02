import { Component, OnInit } from '@angular/core';
import {Page} from "../../../core/page/page";
import {Router} from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {isNull} from "util";
declare var $: any;

//修改状态弹窗
const swal = require('sweetalert');

@Component({
  selector: 'app-limittab',
  templateUrl: './limittab.component.html',
  styleUrls: ['./limittab.component.scss']
})
export class LimittabComponent implements OnInit {
  private menuData:Page = new Page();
  private operationData:Page = new Page();
  private controlData:Page = new Page();
  private tableButtonConfig:Array<object>;  //列表按钮配置
  private tableButtonConfig1:Array<object>;  //列表按钮配置
  constructor(private ajax:AjaxService, private router:Router) {
    let _this = this;
    //多按钮配置
    this.tableButtonConfig = [
      {
        title: "修改菜单",
        type: "update",
        size:"xs",
        //iconsClass:"icon-handbag",
        //btnClass:"btn btn-success",
      }
    ]
    this.tableButtonConfig1 = [
      {
        title: "添加",
        type: "add",
        //iconsClass:"icon-handbag",
        //btnClass:"btn btn-success",
      }
    ]
  }

  ngOnInit() {
    this.pageMenus(); //页面元素信息加载
  }


  //页面元素分页分页列表
  public pageMenus(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;

    this.ajax.get({
      url: "/limitPage/listpage",
      data: {
        curPage: activePage,
        pageSize:'3'
      },
      success: (data) => {
        if (!isNull(data)) {
          me.menuData = new Page(data);
        }
      },
      error: (data) => {
        console.log('data', data);
      }
    });
  }


  //页面控制分页列表
  public operationDatas(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    this.ajax.get({
      url: "/limitOpt/listpage",
      data: {
        curPage: activePage,
        pageSize:'3'
      },
      success: (data) => {
        if (!isNull(data)) {
          me.operationData = new Page(data);
        }
      },
      error: (data) => {
        console.log('data', data);
      }
    });
  }


  //文件控制分页列表
  public controlDatas(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;

    this.ajax.get({
      url: "/limitFile/listpage",
      data: {
        curPage: activePage,
        pageSize:'3'
      },
      success: (data) => {
        if (!isNull(data)) {
          me.controlData = new Page(data);
        }
      },
      error: (data) => {
        console.log('data', data);
      }
    });
  }


  /**
   * 修改页面元素状态
   */
  upPagedateState(data){
    console.log(1);
    console.log(data);
    if(data.isUse=="Y"){
      data.isUse="N"
    }else if(data.isUse=="N"){
      data.isUse="Y"
    }
    console.log(data);
    this.ajax.post({
      url: '/limitPage/updateState',
      data: {
        'pageCode': data.pageCode,
        'state': data.isUse
      },
      success: (data) => {
        console.log("页面元素状态已经改变")
        swal('成功提醒', '成功，状态：success', 'success');
        console.log(data);
      },
      error: (data) => {
        console.log("error");
      }
    });
  }


  /**
   * 修改功能操作状态
   */
  upOptdateState(data){
    console.log(1);
    console.log(data);
    if(data.isUse=="Y"){
      data.isUse="N"
    }else if(data.isUse=="N"){
      data.isUse="Y"
    }
    console.log(data);
    this.ajax.post({
      url: '/limitOpt/updateState',
      data: {
        'optCode': data.optCode,
        'state': data.isUse
      },
      success: (data) => {
        console.log("功能操作状态已经改变")
        swal('成功提醒', '成功，状态：success', 'success');
        console.log(data);
      },
      error: (data) => {
        console.log("error");
      }
    });
  }



  /**
   * 修改文件控制状态
   */
  upFiledateState(data){
    console.log(1);
    console.log(data);
    if(data.isUse=="Y"){
      data.isUse="N"
    }else if(data.isUse=="N"){
      data.isUse="Y"
    }
    console.log(data);
    this.ajax.post({
      url: '/limitFile/updateState',
      data: {
        'fileCode': data.fileCode,
        'state': data.isUse
      },
      success: (data) => {
        console.log("文件控制状态已经改变")
        swal('成功提醒', '成功，状态：success', 'success');
        console.log(data);
      },
      error: (data) => {
        console.log("error");
      }
    });
  }
}
