import { Component, OnInit } from '@angular/core';
import {isNull} from "util";
import {AjaxService} from "../../../core/services/ajax.service";
import {Router} from '@angular/router';
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
const swal = require('sweetalert');

@Component({
  selector: 'app-organ',
  templateUrl: './organ.component.html',
  styleUrls: ['./organ.component.scss']
})
export class OrganComponent implements OnInit {
  private table;
  private organs: Page = new Page();
  private buttonConfig;
  private addButton;
  public searchKey:string = '';

  constructor(private ajax: AjaxService, private router:Router) {  }

  ngOnInit() {

    let me = this;
    this.queryDatas();
    //按钮配置
    this.addButton = {
      type:"add",
      text:"添加机构",
      title:'添加机构'
    };
    this.buttonConfig = [
      {
        title:"编辑",
        type: "update",
        callback:function(result,orgCode){
          result.then((id)=>{
            me.router.navigate(['/main/organ/updateOrgan',orgCode]);
          })
        }
      },
      {
        title:"详情",
        type: "details",
        callback:function(result,orgCode) {
          result.then((id)=> {
            me.router.navigate(['/main/organ/orgDetail',orgCode]);
          })
        }
      },
      {
        title:"角色分配",
        type: "build",
        callback:function(result,orgCode) {
          result.then((id)=> {
            me.router.navigate(['/main/organ/addRolesRelation',orgCode]);
          })
        }
      }
    ];

  }
  /**
   * 添加回调方法
   * @param result  promise对象，回传id
   */

  private updateBoss(orgCode){
    this.router.navigate(['/main/organ/updateBoss',orgCode]);
  }

  private updateState(orgCode){
    this.router.navigate(['/main/organ/updateState',orgCode]);
  }

  private updateType(orgCode){
    this.router.navigate(['/main/organ/updateType',orgCode]);
  }

  //转换机构类型
  switchType(typeKey){
    switch(typeKey){
      case 'LEAGUE':
            return "加盟";
      case 'DIRECT':
            return"直营";
      case 'COOPERATE':
            return "合作";
      case 'SUPER':
            return"超管";
      default:
            return"其他"
    }
  }

  //转换机构状态
  switchState(typeKey){
    switch(typeKey){
      case 'NOTCERT':
        return "未认证";
      case 'OPEN':
        return"经营";
      case 'PAUSE':
        return "暂停";
      case 'CLOSE':
        return"关闭";
      case 'DELETE':
        return"删除"
    }
  }

  //转换时间
  switchTime(time){
    //return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/,' ');
    return new Date(parseInt(time)).toLocaleString('chinese',{hour12:false});
  }

  //查询机构列表
  private queryDatas(event?:PageEvent) {
    let me = this,activePage = 1;
    if(typeof event !== "undefined") activePage =event.activePage;
    this.ajax.get({
      url: "/organ/listpage",
      data: {
        curPage:activePage,
        orgName: me.searchKey,
        pageSize: '8'
      },
      success: (res) => {
        if (!isNull(res)) {
          me.organs = new Page(res);
        }
      },
      error: (res) => {
        console.log('organs', res);
      }
    });
  }

  // 登录
  login() {
    this.ajax.post({
      url: '/login/login',
      data: {
        'staffno': 'admin',
        'pwd': '888888'
      },
      success: (data) => {
        swal('登录成功！', '信息列表已自动更新...', 'success');
        console.log('data', data);
      },
      error: (data) => {
        console.log('data', data);
      }
    });
  }
}
