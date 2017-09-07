import {Component, ComponentRef, Injector, OnInit,ViewChild} from '@angular/core';
import {Page} from "../../../core/page/page";
import {AjaxService} from '../../../core/services/ajax.service';
import {isNull,isNullOrUndefined} from "util";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {ToasterConfig, ToasterService} from 'angular2-toaster';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {LimitService} from "./limit.service";
import {Type} from "@angular/compiler/src/output/output_ast";
import {LimittabComponent} from "../limittab/limittab.component";
declare var $:any;

//修改状态弹窗
const swal = require('sweetalert');

@Component({
  selector: 'app-limit',
  templateUrl: './limit.component.html',
  providers: [
    LimitService
  ],
  styleUrls: ['./limit.component.scss'],
})
export class LimitComponent implements OnInit {
  private data:Page = new Page();
  public sysList;//配置服务系统列表
  public flag=false;//用于添加页面元素按钮的显示和隐藏
  private addButton:object;  //添加按钮配置
  private tableButtonConfig:Array<object>;  //列表按钮配置
  private sysCode:string;//系统编码
  private sysName:string = "请选择系统名称";//系统编码
  private menuCode;//权限菜单编码
  private buttonConfig;//权限菜单列表中的添加按钮
  private childMenuCode; //菜单编码，查询子集用
  private childMenuTitList:Array<any> = []; //菜单级别面包屑

  /**
   * 装饰器，实现局部刷新
   */
  @ViewChild(LimittabComponent)
  LimittabComponent:LimittabComponent;

  constructor(private ajax:AjaxService, private router:Router, private limitService:LimitService) {
    let _this = this;
    //多按钮配置
    _this.tableButtonConfig = [
      {
        title: "修改菜单",
        type: "update",
        size: "xs",
        //iconsClass:"icon-handbag",
        //btnClass:"btn btn-success",
        callback: function (result, menuCode) {
          _this.router.navigate(['/main/limit/upMenu', menuCode]);
        }
      }
    ];
    //权限菜单列表中的添加按钮
    _this.buttonConfig = [
      {
        title: "添加菜单",
        type: "add",
        size: 'xs',
      }
    ];
  }

  /**
   * 系统发生变化的时候再次调用，改变权限菜单
   * **/
  onSelectlimit(syscode, sysName):void {
    this.sysCode = syscode;
    this.sysName = sysName;
    this.childMenuCode = null, this.childMenuTitList = []; //清空子集查询
    this.queryDatas();
  }

  /**
   * 权限菜单发生变化的时候再次调用，改变页面元素
   * **/
  onSelecttable(men):void {
    this.menuCode = men;
    this.flag=true;//当点击查看元素的时候将flag设为true，添加页面元素按钮显示
  }


  ngOnInit() {
    let _this = this;
    //单按钮配置
    this.addButton = {
      text: "添加菜单",
      title: "添加菜单",
      type: "add",
      callback: function (result) {
        let sysCode = _this.sysCode;
        $(".mat-tab-group .mat-tab-body-wrapper").css({"display": "block"});
        $(".mat-tab-group .mat-tab-body-wrapper .mat-tab-body").css({"display": "inline"});
      }
    };
    _this.limitService.sysList(_this, true);//选择系统列表
  }

  /**
   * 单按钮点击
   * **/
  toAdd(promose) {
    var _this = this;
    promose.then((id) => {
      _this.showMsg("单按钮点击", id);
    })
  }

  private showMsg(operation, id) {
  }

  /**
   * 查询子集菜单列表
   */
  queryChildMenuList(childCode?, menuName?, isTit?:boolean) {
    let me = this, num = 0;
    me.flag=!me.flag;//flag取反，当点击下级菜单按钮的时候添加页面元素按钮隐藏
    if (isNullOrUndefined(childCode)) {
      this.childMenuCode = null, this.childMenuTitList = []; //清空子集查询
    } else {
      me.childMenuCode = childCode;
      let item = {name: menuName, code: childCode};
      if (!isTit) me.childMenuTitList.push(item); //非点击面包屑路径时，添加面包屑
      else { //点击面包屑路径时，提出点击地址后的面包屑路径
        for (var i = 0; i < me.childMenuTitList.length; i++) {  //获取点击面包屑的路径地址下标
          if (item.code == me.childMenuTitList[i].code) num = i;
        }
        me.childMenuTitList.splice(num + 1); //剔除下标后的路径
      }
    }
    me.data = new Page(me.limitService.queryMenuList(1, 4, me.sysCode, me.childMenuCode));
  }

  /**
   * 返回上一级菜单列表
   */
  goBackMenu() {
    let num = this.childMenuTitList.length;
    if (num - 2 < 0) this.queryChildMenuList();
    else this.queryChildMenuList(this.childMenuTitList[num - 2].code, this.childMenuTitList[num - 2].name, true);
  }

  /**
   * 查询菜单列表
   **/
  public queryDatas(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;

    let listInfos = this.limitService.queryMenuList(activePage, 4, me.sysCode, me.childMenuCode);
    me.data = new Page(listInfos);
  }


  /**
   * 实现局部刷新
   * pageMenus 页面元素
   * operationDatas 功能操作
   * controlDatas  文件控制
   */
  refresh() {
    this.LimittabComponent.pageMenus();
    this.LimittabComponent.operationDatas();
    this.LimittabComponent.controlDatas();
  }

  /**
   * 修改权限菜单状态
   */
  upMenudateState(data) {
    if (data.isUse == "Y") {
      data.isUse = "N"
    } else if (data.isUse == "N") {
      data.isUse = "Y"
    }
    this.ajax.post({
      url: '/limitMenu/updateState',
      data: {
        'menuCode': data.menuCode,
        'state': data.isUse
      },
      success: () => {
        if (data.isUse == "Y") {
          swal('启动成功', '', 'success');
        } else if (data.isUse == "N") {
          swal('停用成功', '', 'success');
        }
      },
      error: (data) => {
        swal('修改权限菜单失败提醒', '', 'error');
      }
    });
  }
}
