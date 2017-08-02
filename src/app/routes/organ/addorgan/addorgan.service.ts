import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {SettingsService} from "../../../core/settings/settings.service";
import { Location }from '@angular/common';
import { Router} from '@angular/router';
const swal = require('sweetalert');

@Injectable()
export class AddorganService {

  constructor(private ajax: AjaxService, public settings: SettingsService, private Location: Location, private router:Router) { }
  //获取机构类型
  getOrgTypes(){
    let orgTypes;
    this.ajax.get({
      url: '/organ/typelist',
      async: false,
      success: (res) => {
        orgTypes = res;
        console.log("█ res ►►►",  res);
      },
      error: (res) => {
        console.log("get orgTypes error");
      }
    });
    return orgTypes;
  }

  //获取机构状态
  getOrgStates(){
    let orgStates;
    this.ajax.get({
      url: '/organ/statelist',
      async: false,
      success: (res) => {
        orgStates = res;
        console.log("█ res ►►►",  res);
      },
      error: (res) => {
        console.log("get orgStates error");
      }
    });
    return orgStates;
  }

  //通过orgCode获取机构详细信息
  getOrgDetailByCode(organCode){
    let organ;
    this.ajax.get({
      url: '/organ/load',
      async: false,
      data:{
        orgCode: organCode
      },
      success: (res) => {
        if(res.success){
          organ = res.data;
        }
      },
      error: (res) => {
        console.log("get orgTypes error");
      }
    });
    return organ;
  }

  submitData(submitUrl,submitData){
    this.ajax.post({
      url: submitUrl,
      async: false,
      data: submitData,
      success: (res) => {
        console.log("█ res ►►►",  res);
        if (res.success){
          this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
          swal({
            title: '提交成功!',
            text: '列表已自动更新',
            type: 'success',
            timer: 2000, //关闭时间，单位：毫秒
            showConfirmButton: false  //不显示按钮
          });
        }else{
          let errorMsg = res.data.substring(res.data.indexOf('$$')+2,res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post organ error");
      }
    })
  }
}
