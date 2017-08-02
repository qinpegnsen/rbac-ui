import { Component, OnInit } from '@angular/core';
import {isNull} from "util";
import {Router} from '@angular/router';
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {Page} from "../../../core/page/page";
import {AjaxService} from "../../../core/services/ajax.service";

const swal = require('sweetalert');

@Component({
  selector: 'app-sys-platform',
  templateUrl: './sys-platform.component.html',
  styleUrls: ['./sys-platform.component.scss']
})
export class SysPlatformComponent implements OnInit {
  private addButton;
  private searchKey:string = '';
  private sys: Page = new Page();
  private isChecked:boolean;



  constructor(private ajax: AjaxService, private router:Router) { }

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
    let submitUrl, successText;
    if(checked) {
      submitUrl = '/sys/updateToY';
      successText = '该系统已启用';
    }else{
      submitUrl = '/sys/updateToN';
      successText = '该系统已停用';
    };
    console.log("█ checked ►►►",  checked);
    console.log("█ sysCode ►►►",  sysCode);
    console.log("█ submitUrl ►►►",  submitUrl);
    this.ajax.post({
      url: submitUrl,
      data:{
        sysCode: sysCode
      },
      success: (res) => {
        if(res.success){
          swal({
            title: '提交成功!',
            text: successText,
            type: 'success',
            timer: 2000, //关闭时间，单位：毫秒
            showConfirmButton: false  //不显示按钮
          });
        }
      },
      error: (res) => {
        console.log("停用/启用系统 error");
        //console.log("█ res ►►►",  res);
        //let errorMsg = res.data.substring(res.data.indexOf('$$')+2,res.data.indexOf('@@'))
        //swal(res.info, errorMsg, 'error');
      }
    });
  }

  //转换时间
  switchTime(time){
    //return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/,' ');
    return new Date(parseInt(time)).toLocaleString('chinese',{hour12:false});
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
    let me = this,activePage = 1;
    if(typeof event !== "undefined") activePage =event.activePage;
    this.ajax.get({
      url: "/sys/listpage",
      data: {
        curPage:activePage,
        sysName: me.searchKey,
        pageSize: '8'
      },
      success: (res) => {
        if (!isNull(res)) {
          me.sys = new Page(res);
        }
      },
      error: (res) => {
        console.log('organs', res);
      }
    });
  }
}
