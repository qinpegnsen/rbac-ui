import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";

@Injectable()
export class AddSysService {

  constructor(private ajax: AjaxService) { }

  /**
   * 获取某个系统详情
   * @param sysCode
     */
  getSystemDetail(sysCode){
    let result;
    this.ajax.get({
      url: '/sys/load',
      async: false,
      data:{
        sysCode: sysCode
      },
      success: (res) => {
        if(res.success){
          result = res.data;
          //this.system = res.data;
        }
      },
      error: (res) => {
        console.log("get systemDetail error");
      }
    });
    return result;
  }

}
