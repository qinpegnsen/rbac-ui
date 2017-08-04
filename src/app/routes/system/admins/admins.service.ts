import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {isNull} from "util";
const swal = require('sweetalert');

@Injectable()
export class AdminsService {

  constructor(private ajax: AjaxService) { }

  /**
   * 请求管理员列表
   * @param requestParmas
   * @returns {any}
     */
  getAdminsList(requestParmas){
    let result;
    this.ajax.get({
      url: "/orgManager/listpage",
      async:false,
      data: requestParmas,
      success: (res) => {
        if (!isNull(res)) {
          result = res;
        }
      },
      error: (res) => {
        console.log('organs', res);
      }
    });
    return result;
  }

  /**
   * 修改管理员状态
   * @param state
   * @param mgrCode
     */
  changeOrgManagerState(state,mgrCode){
    this.ajax.post({
      url: "/orgManager/updateState",
      data: {
        mgrCode:mgrCode,
        state: state,
      },
      success: (res) => {
        if (res.success) {
          console.log("█ res ►►►",  res);
          swal({
            title: '修改成功!',
            text: res.info,
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
        console.log('changeOrgManagerState', res);
      }
    });
  }

}


