import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";

@Injectable()
export class BindRoleService {

  constructor(private ajax: AjaxService) { }

  /**
   * 获取角色和角色组列表
   * @param mgrCode
   * @param orgCode
   * @returns {any}
   */
  getRoleAndGroupList(sysCode,staffCode:string){
    console.log("█ staffCode ►►►", staffCode );
    console.log("█ sysCode ►►►", sysCode );

    let result;
    this.ajax.post({
      url: '/staff/rolesList',
      async:false,
      data:{
        staffCode: staffCode,
        sysCode: sysCode
      },
      success: (res) => {
        result = res;
        console.log("█ getRoleAndGroupList ►►►",  res);
      },
      error: (res) => {
        console.log("get getRoleAndGroupList error");
      }
    });
    return result;
  }

}
