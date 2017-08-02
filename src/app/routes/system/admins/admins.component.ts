import { Component, OnInit } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {Router} from '@angular/router';
import {isNull} from "util";
const swal = require('sweetalert');

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  private addButton;
  private orgCode:string = '';
  private mgrName:string = '';
  private areaCode:string = '';
  private admins: Page = new Page();

  constructor(private ajax: AjaxService, private router:Router) { }

  ngOnInit() {
    this.queryDatas();
    this.addButton = {
      type:"add",
      text:"新增管理员",
      title:'新增管理员'
    };

  }


  //从子组件获取所选区域数据
  getAreaData(outData){
    console.log("█ outData ►►►",  outData);
    this.areaCode = outData.areaCode;
    this.queryDatas()
  }

  //从子组件获取所选机构数据
  getOrganCode(orgCode){
    console.log("█ orgCode ►►►",  orgCode);
    this.orgCode = orgCode;
    this.queryDatas()
  }


  //转换时间
  switchTime(time){
    if(!isNull(time)){
      return new Date(parseInt(time)).toLocaleString('chinese',{hour12:false});
    }else{
      return ''
    }
  }

  //修改管理员信息按钮跳转事件
  private updateAdmin(mgrCode){
    this.router.navigate(['/main/system/admins/updateAdmin',mgrCode]);
  }

  //查看某个管理员详情
  private adminDetail(mgrCode){
    this.router.navigate(['/main/system/admins/adminDetail',mgrCode]);
  }

  private updatePwd(mgrCode){
    this.router.navigate(['/main/system/admins/updatePwd',mgrCode]);
  }

  //转换管理员状态
  switchState(stateKey){
    switch(stateKey){
      case 'OPEN':
        return "开启";
      case 'PAUSE':
        return "暂停";
      case 'SUPER':
        return "超管";
      case 'FREEZE':
        return "冻结";
      case 'DELETE':
        return "删除"
    }
  }

  changeState(state,mgrCode){
    this.ajax.post({
      url: "/orgManager/updateState",
      data: {
        mgrCode:mgrCode,
        state: state,
      },
      success: (res) => {
        if (res.success) {
          console.log("█ res ►►►",  res);
          swal({
            title: '修改成功!',
            text: res.info,
            type: 'success',
            timer: 2000, //关闭时间，单位：毫秒
            showConfirmButton: false  //不显示按钮
          });
        }else{
          let errorMsg = res.data.substring(res.data.indexOf('$$')+2,res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log('changeState', res);
      }
    });
  }

  //查询管理员列表
  private queryDatas(event?:PageEvent) {
    let me = this,activePage = 1;
    if(typeof event !== "undefined") activePage =event.activePage;
    this.ajax.get({
      url: "/orgManager/listpage",
      data: {
        curPage: activePage,
        mgrName: me.mgrName,
        orgCode: me.orgCode,
        areaCode: me.areaCode,
        pageSize: '8'
      },
      success: (res) => {
        if (!isNull(res)) {
          me.admins = new Page(res);
        }
      },
      error: (res) => {
        console.log('organs', res);
      }
    });
  }

}
