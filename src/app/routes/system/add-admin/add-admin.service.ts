import {Injectable} from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {SettingsService} from "../../../core/settings/settings.service";
const swal = require('sweetalert');

@Injectable()
export class AddAdminService {

  constructor(private ajax: AjaxService, public settings: SettingsService) {
  }

  //获取某个系统详情
  getAdminDetail(mgrCode) {
    let result;
    this.ajax.get({
      url: '/orgManager/load',
      async: false,
      data: {
        mgrCode: mgrCode
      },
      success: (res) => {
        if (res.success) {
          result = res.data;
          console.log("█ res ►►►", res);
        }
      },
      error: (res) => {
        console.log("get systemDetail error");
      }
    });
    return result;
  }

  /**
   * 提交右弹窗数据
   * @param submitUrl
   * @param submitData
   */
  submitRightPageData(submitUrl, submitData) {
    let me = this;
    me.ajax.post({
      url: submitUrl,
      data: submitData,
      async: false,
      success: (res) => {
        console.log("█ res ►►►", res);
        if (res.success) {
          this.settings.closeRightPageAndRouteBack()//关闭右侧页面并返回上级路由
          swal({
            title: '提交成功!',
            text: res.info,
            type: 'success',
            timer: 2000, //关闭时间，单位：毫秒
            showConfirmButton: false  //不显示按钮
          });
        } else {
          let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post system error");
      }
    })
  }

  /**
   * 获取角色或角色组方法
   * @param mgrCode
   * @param orgCode
   * @returns {any}
     */
  addRolesRelation(sysCode,orgCode){
    let list;
    this.ajax.post({
      url: '/orgManager/addRolesRelation',
      async: false,
      data: {
        sysCode: sysCode,
        orgCode: orgCode
      },
      success: (res) => {
        if(res.success){
          //list = res.data;
          console.log("█ addRolesRelation ►►►",  res);
        }
      },
      error: (res) => {
        console.log("get addRolesRelation error");
      }
    });
    return list;
  }

  /**
   * 获取角色列表
   * @param sysCode
   * @param orgCode
   * @returns {any}
     */
  getRoleList(sysCode:string,orgCode?:string){
    let list;
    this.ajax.get({
      url: '/role/list',
      async:false,
      data:{
        sysCode: sysCode,
        orgCode: orgCode
      },
      success: (res) => {
        list = res;
        console.log("█ getRoleList ►►►",  res);
      },
      error: (res) => {
        console.log("get getRoleList error");
      }
    });
    return list;
  }

  /**
   * 获取角色组列表
   * @param sysCode
   * @param orgCode
   * @returns {any}
   */
  getRoleGroupList(sysCode:string,orgCode?:string){
    let list;
    this.ajax.get({
      url: '/role/list',
      async:false,
      data:{
        sysCode: sysCode,
        orgCode: orgCode
      },
      success: (res) => {
        list = res;
        console.log("█ getRoleList ►►►",  res);
      },
      error: (res) => {
        console.log("get getRoleList error");
      }
    });
    return list;
  }
}
