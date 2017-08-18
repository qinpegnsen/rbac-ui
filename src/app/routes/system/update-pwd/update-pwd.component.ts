import {Component, OnInit} from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {isNullOrUndefined} from "util";
const swal = require('sweetalert');

@Component({
  selector: 'app-update-pwd',
  templateUrl: './update-pwd.component.html',
  styleUrls: ['./update-pwd.component.scss']
})
export class UpdatePwdComponent implements OnInit {
  private superAdmin: boolean = false;
  private upPwd = {}

  constructor(private ajax: AjaxService, public settings: SettingsService) {
  }

  ngOnInit() {
    let me = this,
      userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    me.upPwd['mgrCode'] = userInfo.mgrCode;
    me.upPwd['mgrName'] = userInfo.mgrName;
    if(userInfo.orgCode === '#'){
      this.superAdmin = true;
    }
  }

  update(){
    let me = this, submitUrl;
    if(me.superAdmin){
      submitUrl = '/orgManager/updatePwdForSuper'
    }else{
      submitUrl = '/orgManager/updatePwd'
    };
    console.log("█ this.upPwd ►►►",  this.upPwd);
    me.ajax.post({
      url: submitUrl,
      data: this.upPwd,
      async: false,
      success: (res) => {
        console.log("█ res ►►►", res);
        if (res.success) {
          swal({
            title: '提交成功!',
            text: res.info,
            type: 'success',
            timer: 2000, //关闭时间，单位：毫秒
            showConfirmButton: false  //不显示按钮
          });
        } else {
          let errorMsg;
          if(isNullOrUndefined(res.data)){
            errorMsg = res.info
          }else {
            errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          }
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post pwd error");
      }
    })
  }
}
