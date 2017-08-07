import { Component, OnInit , Input ,OnChanges,SimpleChanges} from '@angular/core';
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
export class LimittabComponent implements OnInit ,OnChanges {
  private menuData:Page = new Page();
  private operationData:Page = new Page();
  private controlData:Page = new Page();
  private tableButtonConfig:Array<object>;  //列表按钮配置
  private tableButtonConfig1:Array<object>;  //页面添加列表按钮配置
  private tableButtonConfig2:Array<object>;  //功能添加列表按钮配置
  private tableButtonConfig3:Array<object>;  //文件添加列表按钮配置
  private buttonConfig;//页面列表中的添加按钮
  @Input()
  public sysCode;//获取系统编码
  @Input()
  public menuCode;//获取权限菜单编码
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
    ];
    this.tableButtonConfig1 = [
      {
        text: "添加元素",
        title: "添加",
        type: "add",
      }
    ];
    this.tableButtonConfig2 = [
      {
        text: "添加功能",
        title: "添加",
        type: "add",
      }
    ];
    this.tableButtonConfig3 = [
      {
        text: "添加文件",
        title: "添加",
        type: "add",
      }
    ];
    //页面元素列表中的添加按钮
    this.buttonConfig = [
      {
        title: "添加菜单",
        type: "add",
        size:'xs',
      }
    ];
  }



  ngOnInit() {
    this.pageMenus(); //页面元素信息加载
  }

  /**
   * 钩子，输入属性变化的时候调用页面元素
   * **/
  ngOnChanges(changes: SimpleChanges): void {
    //当sysCode变化的时候再次调动
    if(changes["sysCode"] && this.sysCode){
      this.pageMenus();
      this.operationDatas();
      this.controlDatas();
    }else if(changes["menuCode"] && this.menuCode){
      this.pageMenus();
      this.operationDatas();
      this.controlDatas();
    }
  }

  /**
   * 页面元素分页分页列表
   * **/
  public pageMenus(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;

    this.ajax.get({
      url: "/limitPage/listpage",
      data: {
        curPage: activePage,
        pageSize:'3',
        sysCode:this.sysCode,
        menuCode:this.menuCode
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


  /**
   * 页面控制分页列表
   * **/
  public operationDatas(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    this.ajax.get({
      url: "/limitOpt/listpage",
      data: {
        curPage: activePage,
        pageSize:'3',
        sysCode:this.sysCode,
        menuCode:this.menuCode
      },
      success: (data) => {
        if (!isNull(data)) {
          me.operationData = new Page(data);
          console.log(data)
        }
      },
      error: (data) => {
        console.log('data', data);
        console.log('页面控制分页列表错误');
      }
    });
  }


  /**
   * 文件控制分页列表
   * **/
  public controlDatas(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;

    this.ajax.get({
      url: "/limitFile/listpage",
      data: {
        curPage: activePage,
        pageSize:'3',
        sysCode:this.sysCode,
        menuCode:this.menuCode
      },
      success: (data) => {
        if (!isNull(data)) {
          me.controlData = new Page(data);
          console.log(data);
          console.log(this.menuCode);

        }
      },
      error: (data) => {
        console.log("文件控制错误");
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
        swal('成功提醒', '成功');
      },
      error: (data) => {
        swal('失败提醒', '失败');
      }
    });
  }


  /**
   * 修改功能操作状态
   */
  upOptdateState(data){
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
        swal('成功提醒', '成功');
      },
      error: (data) => {
        swal('失败提醒', '失败');
      }
    });
  }



  /**
   * 修改文件控制状态
   */
  upFiledateState(data){
    if(data.isUse=="Y"){
      data.isUse="N"
    }else if(data.isUse=="N"){
      data.isUse="Y"
    }
    this.ajax.post({
      url: '/limitFile/updateState',
      data: {
        'fileCode': data.fileCode,
        'state': data.isUse
      },
      success: (data) => {
        swal('成功提醒', '成功');
      },
      error: (data) => {
        swal('失败提醒', '失败');
      }
    });
  }
}
