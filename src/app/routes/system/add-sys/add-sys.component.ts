import { Component, OnInit } from '@angular/core';
import { Location }from '@angular/common';
import {AjaxService} from "../../../core/services/ajax.service";
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AddSysService} from "./add-sys.service";
import {AddAdminService} from "../add-admin/add-admin.service";
import {SysPlatformComponent} from "../sys-platform/sys-platform.component";

const swal = require('sweetalert');

@Component({
  selector: 'app-add-sys',
  templateUrl: './add-sys.component.html',
  styleUrls: ['./add-sys.component.scss'],
  providers: [Location,AddSysService,AddAdminService]
})
export class AddSysComponent implements OnInit {
  private pageTitle:string = '添加系统';
  private path: string;
  private system = { };
  private sysDetail:boolean = false;

  constructor(private addSysService: AddSysService,public settings: SettingsService,
              private route: ActivatedRoute, private router:Router,
              private Location: Location,private addAdminService:AddAdminService,
              private sysPlatformComponent:SysPlatformComponent) {
    this.settings.showRightPage("28%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {
    let me = this;

    //获取当前路由
    me.route.url.subscribe(urls => {
      me.path = urls[0].path;
      console.log("█ me.path ►►►",  me.path);
      switch(me.path) {
        //添加系统
        case "addSystem":
          console.log("█ \"添加系统\" ►►►",  "添加系统");
          me.pageTitle = "添加系统";
          break;

        //查看系统详情
        case "sysDetail":
          console.log("█ \"查看系统详情\" ►►►",  "查看系统详情");
          me.sysDetail = true;//属于查看详情，需要隐藏可编辑表单
          me.pageTitle = "系统详情";
          me.getSysCode();//获取系统代码(路由参数)
          me.system = me.addSysService.getSystemDetail(this.system['sysCode'])//获取某个系统详情
          break;

        //修改系统信息
        case "updateSystem":
          console.log("█ \"修改系统信息\" ►►►",  "修改系统信息");
          me.pageTitle = "修改系统";
          me.getSysCode();//获取系统代码(路由参数)
          me.system = me.addSysService.getSystemDetail(this.system['sysCode'])//获取某个系统详情
          break;
      }

    });
  }
  //获取系统代码(路由参数)
  getSysCode(){
    this.route.params.subscribe(params => {
      this.system['sysCode'] = params['sysCode'];
    });
  }

  //从详情去修改
  toUpdateSystem(){
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.router.navigate(['/main/system/sys-platform/updateSystem',this.system['sysCode']], { replaceUrl: true });
  }

  //提交表单
  submitSysData(){
    let me = this;
    let submitUrl,submitData;
    submitUrl = '/sys/add';
    submitData = me.system;
    switch(this.path) {
      //添加系统
      case "addSystem":
        submitUrl = '/sys/add';
            break;
      case "updateSystem":
        submitUrl = '/sys/update';
        break;
    }
    console.log("█ submitData ►►►",  submitData);
    me.addAdminService.submitRightPageData(submitUrl,submitData);
    me.sysPlatformComponent.ngOnInit()
  }

  // 取消
  cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }
}
