import { Component, OnInit } from '@angular/core';
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {Router} from '@angular/router';
import {AdminsService} from "./admins.service";
import {SettingsService} from "../../../core/settings/settings.service";

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  providers: [AdminsService]
})
export class AdminsComponent implements OnInit {
  private addButton;
  private orgCode:string = '';
  private mgrName:string = '';
  private areaCode:string = '';
  private admins: Page = new Page();

  constructor(private router:Router, private admin:AdminsService, public settings: SettingsService) { }

  ngOnInit() {
    this.queryDatas();//获取管理员表格数据
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
    this.queryDatas()//获取管理员表格数据
  }

  /**
   * 从子组件获取所选机构数据
   * @param orgCode
     */
  getOrganCode(orgCode){
    console.log("█ orgCode ►►►",  orgCode);
    this.orgCode = orgCode;
    this.queryDatas()//获取管理员表格数据
  }


  /**
   * 转换时间
   * @param time
     */
  switchTime(time){
    let me = this,normTime = me.settings.switchTime(time);
    return normTime;
  }

  /**
   * 修改管理员信息按钮跳转事件
   * @param mgrCode
     */
  private updateAdmin(mgrCode){
    this.router.navigate(['/main/system/admins/updateAdmin',mgrCode]);
  }

  /**
   * 查看某个管理员详情
   * @param mgrCode
     */
  private adminDetail(mgrCode){
    this.router.navigate(['/main/system/admins/adminDetail',mgrCode]);
  }

  /**
   * 修改密码
   * @param mgrCode
     */
  private updatePwd(mgrCode){
    this.router.navigate(['/main/system/admins/updatePwd',mgrCode]);
  }

  /**
   * 转换管理员状态
   * @param stateKey
   * @returns {string}
     */
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

  /**
   * 修改管理员状态
   * @param state
   * @param mgrCode
     */
  changeState(state,mgrCode){
    this.admin.changeOrgManagerState(state,mgrCode)
  }

  /**
   * 获取管理员表格数据
   * @param event
     */
  private queryDatas(event?:PageEvent) {
    let me = this,activePage = 1;
    if(typeof event !== "undefined") activePage =event.activePage;
    let requestParmas = {
      curPage: activePage,
      mgrName: me.mgrName,
      orgCode: me.orgCode,
      areaCode: me.areaCode,
      pageSize: '10'
    };
    let result = this.admin.getAdminsList(requestParmas);//请求管理员列表
    me.admins = new Page(result);
  }
}
