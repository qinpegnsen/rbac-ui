import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";

@Injectable()
export class AddorganService {

  constructor(private ajax: AjaxService) {

  }

  /**
   * 获取机构类型
   * @returns {any}
     */
  getOrgTypes(){
    let orgTypes;
    this.ajax.get({
      url: '/organ/typelist',
      async: false,
      success: (res) => {
        orgTypes = res;
        //console.log("█ res ►►►",  res);
      },
      error: (res) => {
        console.log("get orgTypes error");
      }
    });
    return orgTypes;
  }

  /**
   * 获取机构状态
   * @returns {any}
     */
  getOrgStates(){
    let orgStates;
    this.ajax.get({
      url: '/organ/statelist',
      async: false,
      success: (res) => {
        orgStates = res;
        //console.log("█ res ►►►",  res);
      },
      error: (res) => {
        console.log("get orgStates error");
      }
    });
    return orgStates;
  }

  /**
   * 通过orgCode获取机构详细信息
   * @param organCode
   * @returns {any}
     */
  getOrgDetailByCode(organCode){
    let organ;
    this.ajax.get({
      url: '/organ/load',
      async: false,
      data:{
        orgCode: organCode
      },
      success: (res) => {
        if(res.success){
          organ = res.data;
          //console.log("█ organ ►►►",  organ);
        }
      },
      error: (res) => {
        console.log("get orgTypes error");
      }
    });
    return organ;
  }


  /**
   * 获取已经分配的角色和角色组列表
   * @param mgrCode
   * @param orgCode
   * @returns {any}
   */
  getMyRoleAndGroupList(sysCode:string,orgCode:string){
    let result;
    this.ajax.post({
      url: '/organ/myRolesList',
      async:false,
      data:{
        sysCode: sysCode,
        orgCode: orgCode
      },
      success: (res) => {
        result = res;
        //console.log("█ getRoleAndGroupList ►►►",  res);
      },
      error: (res) => {
        console.log("get getRoleAndGroupList error");
      }
    });
    return result;
  }

  /**
   * 获取未被分配的角色和角色组列表
   * @param mgrCode
   * @param orgCode
   * @returns {any}
   */
  getRoleAndGroupList(sysCode:string,orgCode:string){
    let result;
    this.ajax.post({
      url: '/organ/rolesList',
      async:false,
      data:{
        sysCode: sysCode,
        orgCode: orgCode
      },
      success: (res) => {
        result = res;
        //console.log("█ getRoleAndGroupList ►►►",  res);
      },
      error: (res) => {
        console.log("get getRoleAndGroupList error");
      }
    });
    return result;
  }
}
