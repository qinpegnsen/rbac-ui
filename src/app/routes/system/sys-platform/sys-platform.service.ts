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
      async: false,
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

  /**
   * 获取系统列表，分页
   * @param requestParams
   * @returns {any}
     */
  getSystemListPage(requestParams){
    let list;
    this.ajax.get({
      url: "/sys/listpage?isAll=Y",
      data: requestParams,
      async: false,
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
  /**
   * 获取系统列表，不分页
   * @param requestParams
   * @returns {any}
   */
  getSystemList(){
    let list;
    this.ajax.get({
      url: "/sys/list",
      async: false,
      data: '',
      success: (res) => {
        if (!isNull(res)) {
          list = res;
        }
      },
      error: (res) => {
        console.log('getSystemList error');
      }
    });
    return list;
  }
}
