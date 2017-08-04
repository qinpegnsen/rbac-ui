import { Component, OnInit } from '@angular/core';
import {Page} from "../../../core/page/page";
import {AjaxService} from '../../../core/services/ajax.service';
import {isNull} from "util";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {ToasterConfig, ToasterService} from 'angular2-toaster';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {LimitService} from "./limit.service";
declare var $: any;

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
  private data: Page = new Page();
  public sysList;
  private addButton:object;  //添加按钮配置
  private tableButtonConfig: Array<object>;  //列表按钮配置
  private sysCode:string;//系统编码
  private menuCode;//权限菜单编码
  private buttonConfig;//权限菜单列表中的添加按钮

  constructor(private ajax: AjaxService,private router: Router,private limitService:LimitService) {
    var _this = this;
    /*let sysCode = _this.sysCode;
    //单按钮配置
    this.addButton={
      text: "添加菜单",
      title: "添加菜单",
      type: "add",
      callback: function (result) {
        $(".mat-tab-group .mat-tab-body-wrapper").css({"display":"block"});
        $(".mat-tab-group .mat-tab-body-wrapper .mat-tab-body").css({"display":"inline"});
        result.then((id)=>{
          _this.router.navigate(['/main/limit/addMenu',sysCode]);
        })
        //_this.router.navigate(['/main/limit/addMenu',sysCode]);
      }
    };*/

    //多按钮配置
    this.tableButtonConfig = [
      {
        title:"修改菜单",
        type: "update",
        size:"xs",
        //iconsClass:"icon-handbag",
        //btnClass:"btn btn-success",
        callback: function (result,menuCode) {
          //this.router.navigate(['/main/limit/addMenu']);
          _this.router.navigate(['/main/limit/upMenu',menuCode]);
        }
      }
    ];
    //权限菜单列表中的添加按钮
    this.buttonConfig = [
      {
        title: "添加菜单",
        type: "add",
        size:'xs',
      }
    ];
  }

  //系统发生变化的时候再次调用，改变权限菜单
  onSelectlimit(sys): void {
    this.sysCode = sys.value;
    this.queryDatas();
  }

  //权限菜单发生变化的时候再次调用，改变页面元素
  onSelecttable(men): void {
    this.menuCode = men;
    //this.queryDatas();
  }



  ngOnInit() {

    var _this = this;
    //单按钮配置
    this.addButton={
      text: "添加菜单",
      title: "添加菜单",
      type: "add",
      callback: function (result) {
        let sysCode = _this.sysCode;
        $(".mat-tab-group .mat-tab-body-wrapper").css({"display":"block"});
        $(".mat-tab-group .mat-tab-body-wrapper .mat-tab-body").css({"display":"inline"});
        /*result.then((id)=>{
          _this.router.navigate(['/main/limit/addMenu']);
        })*/
        //_this.router.navigate(['/main/limit/addMenu',sysCode]);
      }
    };
    //选择系统列表
    this.sysList = this.limitService.sysList();
    console.log("█ sysList ►►►", this.sysList );

    let me = this;
    this.queryDatas();
  }


  toAdd(promose) {
    var _this = this;
    promose.then((id) => {
      _this.showMsg("单按钮点击", id);
    })
  }

  private showMsg(operation, id) {
  }


  //添加菜单列表
  private queryDatas(event?:PageEvent) {
    let me = this,activePage = 1;
    if(typeof event !== "undefined") activePage =event.activePage;

    this.ajax.get({
      url: "/limitMenu/listpage",
      data: {
        curPage:activePage,
        pageSize:'3',
        sysCode:this.sysCode
      },
      success: (data) => {
        console.log('data', data);
        if (!isNull(data)) {
          me.data = new Page(data);
        }
      },
      error: (data) => {
        console.log('data', data);
      }
    });
  }


    /**
     * 修改权限菜单状态
     */
    upMenudateState(data){
      if(data.isUse=="Y"){
        data.isUse="N"
      }else if(data.isUse=="N"){
        data.isUse="Y"
      }
      console.log(data);
      this.ajax.post({
        url: '/limitMenu/updateState',
        data: {
          'menuCode': data.menuCode,
          'state': data.isUse
        },
        success: (data) => {
          console.log("权限菜单状态已经改变")
          swal('成功提醒', '成功，状态：success', 'success');
        },
        error: (data) => {
          console.log("error");
        }
      });
    }

}
