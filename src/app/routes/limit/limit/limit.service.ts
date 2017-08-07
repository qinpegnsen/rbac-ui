import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {Page} from "../../../core/page/page";

@Injectable()
export class LimitService {

  constructor(private ajax:AjaxService) {
  }

  /**
   * 系统列表
   * @returns {any}
   */
  sysList() {
    let sysList = [];
    this.ajax.get({
      url: '/sys/list',
      async: false,
      data: {
        'sysName': ''
      },
      success: (data) => {
        sysList = data;
        console.log("█ sysList ►►►", sysList);
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
   * @returns {any}
   */
  queryMenuList(activePage, pageSize, sysCode) {
    let infos = {};
    this.ajax.get({
      url: "/limitMenu/listpage",
      async: false,
      data: {
        curPage: activePage,
        pageSize: pageSize,
        sysCode: sysCode
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
