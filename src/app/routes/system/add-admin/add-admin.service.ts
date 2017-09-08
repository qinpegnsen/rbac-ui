import {Injectable} from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {isNullOrUndefined} from 'util';
import {RoleService} from "../../role/role/role.service";
import {MaskService} from "../../../core/services/mask.service";
import {AppComponent} from "../../../app.component";
const swal = require('sweetalert');

@Injectable()
export class AddAdminService {

  constructor(private ajax: AjaxService,
              public settings: SettingsService,
              private mask: MaskService,
              private roleService: RoleService) {
  }

  /**
   * 获取某个系统详情
   * @param mgrCode
   * @returns {any}
   */
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
          //console.log("█ res ►►►", res);
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
  submitRightPageData(submitUrl, submitData, edit?: boolean) {
    let me = this;
    me.ajax.post({
      url: submitUrl,
      data: submitData,
      async: false,
      success: (res) => {
        console.log("█ res ►►►", res);
        if (res.success) {
          this.mask.hideMask();//关闭遮罩层
          this.settings.closeRightPageAndRouteBack()//关闭右侧页面并返回上级路由
          swal({
            title: '提交成功!',
            text: res.info,
            type: 'success',
            timer: 3000, //关闭时间，单位：毫秒
            showConfirmButton: false  //不显示按钮
          });
          if (edit) {
            let data = me.roleService.getSysList();//获取系统列表的数据
            localStorage.setItem('sysListData', JSON.stringify(data)); //由于多次调用，所以把数据存储到session里面，减轻服务器压力
          }
        } else {
          this.mask.hideMask();//关闭遮罩层
          let errorMsg;
          if (isNullOrUndefined(res.data)) {
            errorMsg = res.info
          } else {
            errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          }
          AppComponent.rzhAlt("error", errorMsg);
        }
      },
      error: (res) => {
        this.mask.hideMask();//关闭遮罩层
        AppComponent.rzhAlt("error", '网络错误');
        console.log("post system error");
      }
    })
  }

  getRoleGroupList(sysCode: string, orgCode?: string, roleGroupName?: string) {
    let list;
    this.ajax.get({
      url: '/roleGroup/list',
      async: false,
      data: {
        sysCode: sysCode,
        orgCode: orgCode,
        roleGroupName: roleGroupName
      },
      success: (res) => {
        list = res;
        //console.log("█ getRoleGroupList ►►►",  res);
      },
      error: (res) => {
        console.log("get getRoleGroupList error");
      }
    });
    return list;
  }

  /**
   * 获取已有的角色和角色组列表
   * @param mgrCode
   * @param orgCode
   * @returns {any}
   */
  getMyRoleAndGroupList(sysCode, mgrCode: string, orgCode: string) {
    let result;
    this.ajax.post({
      url: '/orgManager/myRolesList',
      async: false,
      data: {
        mgrCode: mgrCode,
        orgCode: orgCode,
        sysCode: sysCode
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
   * 获取角色和角色组列表
   * @param mgrCode
   * @param orgCode
   * @returns {any}
   */
  getRoleAndGroupList(sysCode, mgrCode: string, orgCode: string) {
    console.log("█ mgrCode ►►►", mgrCode);
    console.log("█ orgCode ►►►", orgCode);

    let result;
    this.ajax.post({
      url: '/orgManager/rolesList',
      async: false,
      data: {
        mgrCode: mgrCode,
        orgCode: orgCode,
        sysCode: sysCode
      },
      success: (res) => {
        result = res;
        console.log("█ getRoleAndGroupList ►►►", res);
      },
      error: (res) => {
        console.log("get getRoleAndGroupList error");
      }
    });
    return result;
  }
}
