import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";

@Injectable()
export class LimitService {

  constructor(private ajax:AjaxService) {
  }

  /**
   * 系统列表
   * @returns {any}
   */
  sysList() {
    let sysList=[];
    this.ajax.get({
      url: '/sys/list',
      async:false,
      data: {
        'sysName': ''
      },
      success: (data) => {
        sysList = data;
        console.log("█ sysList ►►►", sysList );
      },
      error: (data) => {
        console.log("error");
      }
    });
    return sysList;
  }
}
