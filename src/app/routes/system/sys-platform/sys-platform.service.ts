import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {isNull} from "util";
const swal = require('sweetalert');

@Injectable()
export class SysPlatformService {

  constructor(private ajax: AjaxService) { }

  /**
   * 停/启用系统
   * @param submitUrl
   * @param sysCode
     */
  openOrCloseSys(submitUrl,sysCode){
    this.ajax.post({
      url: submitUrl,
      data:{
        sysCode: sysCode
      },
      success: (res) => {
        if(res.success){
          swal({
            title: '提交成功!',
            text: res.info,
            type: 'success',
            timer: 2000, //关闭时间，单位：毫秒
            showConfirmButton: false  //不显示按钮
          });
        }
      },
      error: (res) => {
        console.log("停用/启用系统 error");
      }
    });
  }

  getSystemList(requestParams){
    let list;
    this.ajax.get({
      url: "/sys/listpage",
      async: false,
      data: requestParams,
      success: (res) => {
        if (!isNull(res)) {
          list = res;
        }
      },
      error: (res) => {
        console.log('organs', res);
      }
    });
    return list;
  }
}
