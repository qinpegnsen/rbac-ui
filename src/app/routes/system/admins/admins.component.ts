import { Component, OnInit } from '@angular/core';
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {Router} from '@angular/router';
import {AdminsService} from "./admins.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  providers: [AdminsService, RzhtoolsService]
})
export class AdminsComponent implements OnInit {
  private addButton;
  private buttonConfig;
  private orgCode:string = '';
  private mgrName:string = '';
  private areaCode:string = '';
  private admins: Page = new Page();

  constructor(private router:Router, private admin:AdminsService, public settings: SettingsService) { }

  ngOnInit() {
    let me = this;
    me.queryDatas();//获取管理员表格数据
    me.addButton = {
      type:"add",
      text:"新增管理员",
      title:'新增管理员'
    };
    me.buttonConfig = [
      {
        title:"编辑",
        type: "update",
        callback:function(result,mgrCode){
          result.then((id)=>{
            me.router.navigate(['/main/system/admins/updateAdmin',mgrCode]);
          })
        }
      },
      {
        title:"详情",
        type: "details",
        callback:function(result,mgrCode) {
          result.then((id)=> {
            me.router.navigate(['/main/system/admins/adminDetail',mgrCode]);
          })
        }
      },
      {
        title:"角色分配",
        type: "add",
        callback:function(result,mgrCode) {
          result.then((id)=> {
            me.router.navigate(['/main/system/admins/allotRole',mgrCode]);
          })
        }
      }
    ];
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
   * 修改密码
   * @param mgrCode
     */
  private updatePwd(mgrCode){
    this.router.navigate(['/main/system/admins/updatePwd',mgrCode]);
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
