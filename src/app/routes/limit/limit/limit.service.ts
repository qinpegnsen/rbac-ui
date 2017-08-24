import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {isNull, isNullOrUndefined} from "util";
import {Page} from "../../../core/page/page";

@Injectable()
export class LimitService {

  constructor(private ajax:AjaxService) {
  }


  /**
   * 系统列表
   * @param _this 组件信息
   * @param async true：异步，flase：同步
   * @returns {Array}
     */
  sysList(_this?, async?) {
    let sysList = [],me = this;
    if (isNullOrUndefined(async)) async = false;
    this.ajax.get({
      url: '/sys/list',
      async: async,
      data: {
        'sysName': ''
      },
      success: (data) => {
        sysList = data;
        //若传入参数不为空，进行动态赋值
        if (!isNullOrUndefined(_this)) _this.sysList = data, _this.sysCode = _this.sysList[0].sysCode; //设置系统列表
        if(async) _this.data = new Page(me.queryMenuList(1, 4, _this.sysCode)); //设置第一个系统列表下的权限信息
      },
      error: (data) => {
        console.log("error");
      }
    });
    return sysList;
  }

  /**
   * 查询权限菜单列表
   * @param activePage 当前页
   * @param sysCode 系统编码
   * @param menuCode 菜单编码
   * @returns {any}
   */
  queryMenuList(activePage, pageSize, sysCode,menuCode?) {
    let infos = {};
    this.ajax.get({
      url: "/limitMenu/listpage",
      async: false,
      data: {
        curPage: activePage,
        pageSize: pageSize,
        sysCode: sysCode,
        preMenuCode: menuCode
      },
      success: (data) => {
        infos = data;
      },
      error: (data) => {
        console.log('data', data);
      }
    });
    return infos;
  }

}
