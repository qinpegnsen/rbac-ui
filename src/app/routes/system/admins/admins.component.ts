import { Component, OnInit } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {Router} from '@angular/router';
import {isNull} from "util";

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
  updateAdmin(mgrCode){
    this.router.navigate(['/main/system/admins/updateAdmin',mgrCode]);
  }

  //查看某个管理员详情
  adminDetail(mgrCode){
    this.router.navigate(['/main/system/admins/adminDetail',mgrCode]);
  }

  updateState(mgrCode){
    this.router.navigate(['/main/system/admins/updateState',mgrCode]);
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
        areaCode: me.areaCode
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
