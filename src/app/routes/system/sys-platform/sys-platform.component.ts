import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {Page} from "../../../core/page/page";
import {SysPlatformService} from "./sys-platform.service";
import {SettingsService} from "../../../core/settings/settings.service";


@Component({
  selector: 'app-sys-platform',
  templateUrl: './sys-platform.component.html',
  styleUrls: ['./sys-platform.component.scss'],
  providers :[SysPlatformService]
})
export class SysPlatformComponent implements OnInit {
  private addButton;
  private searchKey:string = '';
  private sys: Page = new Page();
  private isChecked:boolean;

  constructor(private router:Router,private settings: SettingsService,private systemService:SysPlatformService) { }

  ngOnInit() {
    this.queryDatas();
    this.addButton = {
      type:"add",
      text:"添加系统",
      title:'添加系统'
    };

  }

  //停用/启用系统
  quitSystem(checked,sysCode){
    let me = this,submitUrl;
    console.log("█ checked ►►►",  checked);
    if(!checked) {
      submitUrl = '/sys/updateToY';
    }else{
      submitUrl = '/sys/updateToN';
    };
    me.systemService.openOrCloseSys(submitUrl,sysCode);
    me.queryDatas()
  }

  //修改系统信息按钮跳转事件
  changeSysInfo(sysCode){
    this.router.navigate(['/main/system/sys-platform/updateSystem',sysCode]);
  }

  //查看某个系统详情
  lookSysDetail(sysCode){
    this.router.navigate(['/main/system/sys-platform/sysDetail',sysCode]);
  }

  //查询系统列表
  private queryDatas(event?:PageEvent) {
    let me = this,activePage = 1,requestParams;
    if(typeof event !== "undefined") activePage =event.activePage;
    requestParams = {
      curPage: activePage,
      sysName: me.searchKey,
      pageSize: '10'
    };
    let sysList = me.systemService.getSystemListPage(requestParams);
    me.sys = new Page(sysList);
  }
}
