import { Injectable } from '@angular/core';
import {isNull} from "util";
import {AjaxService} from "../../../core/services/ajax.service";

@Injectable()
export class LimttabService {

  constructor(private ajax:AjaxService) { }

  /**
   * 获取菜单列表
   * @param myData
   * @returns {any}
   */
  getPageMenus(myData){
    let result;
    this.ajax.get({
      url: "/limitPage/listpage",
      data: myData,
      async:false,
      success: (data) => {
        if (!isNull(data)) {
          result = data;
        }
      },
      error: (data) => {
        console.log('data', data);
      }
    });
    return result;
  }

}
