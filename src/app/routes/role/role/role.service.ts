import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";

@Injectable()
export class RoleService {
  public result;
  constructor(private ajax: AjaxService) { }

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
}
