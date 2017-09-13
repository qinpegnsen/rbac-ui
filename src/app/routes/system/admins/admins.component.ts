import {Component, OnInit, ViewChild} from "@angular/core";
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {Router} from "@angular/router";
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
  private userOrgCode:string = '';
  private mgrName:string = '';
  private areaCode:string = '';
  private admins: Page = new Page();
  private userState:string;
  private buttons;

  @ViewChild('chooseOrgan') private choosedOrgCode: string;

  constructor(private router:Router, private admin:AdminsService, public settings: SettingsService) { }

  ngOnInit() {
    let me = this,
    userInfo = JSON.parse(localStorage.getItem('loginInfo'));
    me.userState = userInfo['state'];
    me.userOrgCode = userInfo['orgCode'];

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
        size: "xs",
        callback:function(result,mgrCode){
          result.then((id)=>{
            me.router.navigate(['/main/system/admins/updateAdmin',mgrCode]);
          })
        }
      },
      {
        title:"详情",
        type: "details",
        size: "xs",
        callback:function(result,mgrCode) {
          result.then((id)=> {
            me.router.navigate(['/main/system/admins/adminDetail',mgrCode]);
          })
        }
      },
      {
        title:"角色分配",
        type: "add",
        size: "xs",
        callback:function(result,mgrCode,orgCode) {
          result.then((id)=> {
            me.router.navigate(['/main/system/admins/allotRole',mgrCode],{queryParams:{orgCode:orgCode}});
          })
        }
      }
    ];
  }


  /**
   * 从子组件获取所选区域数据,当选择区域时重新获取数据
   * @param outData
     */
  getAreaData(outData){
    //console.log("█ outData ►►►",  outData);
    this.areaCode = outData.areaCode;
    this.queryDatas()//获取管理员表格数据
  }

  /**
   * 从子组件获取所选机构数据,当选择机构时重新获取数据
   * @param orgCode
     */
  getOrganCode(orgCode){
    this.orgCode = orgCode;
    console.log("█ orgCode ►►►",  orgCode);
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
    this.admin.changeOrgManagerState(state,mgrCode);
    this.queryDatas()
  }

  /**
   * 获取管理员表格数据
   * @param event
     */
  queryDatas(event?:PageEvent) {
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
