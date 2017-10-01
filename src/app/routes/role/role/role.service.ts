import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {MaskService} from "../../../core/services/mask.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {AppComponent} from "../../../app.component";
import {isNullOrUndefined} from "util";
const swal = require('sweetalert');

@Injectable()
export class RoleService {
  public result;
  constructor(private ajax: AjaxService,public mask:MaskService,public settings:SettingsService) { }

  getSysList(){
    let that=this;

    /**
     * 系统列表的接口
     * sysCode 初始化系统的编码，默认第一个，然后根据sysCode调用初始化的角色组列表和角色列表
     * sysName 默认的第一个的名字
     * sysList 系统列表的数据
     */
    this.ajax.get({
      url: '/sys/list',
      data: {
        'sysName': ''
      },
      async:false,
      success: (data) => {
        that.result=data;
      },
      error: () => {
        console.log("sys/list  error");
      }
    });
    return that.result;
  }

'/role/limitList'
  /**
   * POST 请求
   * @param submitUrl
   * @param submitData
   * @param back:true(返回上一级)
   */
  postRequest(submitUrl, submitData, back?: boolean) {
    let me = this, result;
    me.ajax.post({
      url: submitUrl,
      data: submitData,
      async: false,
      success: (res) => {
        if(!isNullOrUndefined(res.success)){
          if (res.success) {
            if (back) me.settings.closeRightPageAndRouteBack()//关闭右侧页面并返回上级路由
            swal(res.info, '', 'success');
          } else if (!res.success) {
            AppComponent.rzhAlt("error", res.info);
          }
        }else{
          result = res;
        }
      },
      error: (res) => {
        AppComponent.rzhAlt("error", res.status + '**' + res.statusText);
      }
    })
    return result;
  }
}
