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
  private sysCode;//系统编码

  constructor(private ajax: AjaxService,private router: Router,private limitService:LimitService) {
    var _this = this;
    //单按钮配置
    this.addButton={
      text: "添加菜单",
      title: "添加菜单",
      type: "add",
      callback: function (result) {
        $(".mat-tab-group .mat-tab-body-wrapper").css({"display":"block"});
        $(".mat-tab-group .mat-tab-body-wrapper .mat-tab-body").css({"display":"inline"});
        _this.router.navigate(['/main/limit/addMenu']);
      }
    };

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

    console.log(this.router);
  }

  //菜单根据系统的选择
  onSelectlimit(sys): void {
    this.sysCode = sys.value;
    this.queryDatas();
    console.log(this.sysCode);
  }


  ngOnInit() {

    //选择系统
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


  //添加菜单
  public queryDatas(event?:PageEvent) {
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
