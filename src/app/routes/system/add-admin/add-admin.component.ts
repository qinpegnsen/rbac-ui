import { Component, OnInit,OnChanges,SimpleChanges } from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AddAdminService} from "./add-admin.service";
import {AddorganService} from "../../organ/addorgan/addorgan.service";
import {AdminsService} from "../admins/admins.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {PatternService} from "../../../core/forms/pattern.service";
import {SysPlatformService} from "../sys-platform/sys-platform.service";
import {AdminsComponent} from "../admins/admins.component";


@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
  providers: [AddAdminService, AddorganService, RzhtoolsService,PatternService,SysPlatformService]
})
export class AddAdminComponent implements OnInit,OnChanges {
  private pageTitle:string = '';
  private path:string;//当前路由
  private Admin:boolean = false;//添加/修改管理员
  private adminDetail:boolean = false;//查看详情
  private updatePwd:boolean = false;//修改密码
  private allotRoleOrGroup = false;//分配角色或角色组
  private systems:string;//系统列表
  private adr:string = '';//地址
  private newpwd:string;//新密码
  private sysCode:string;//系统编码
  private admin = { };
  private tempList = [];

  constructor(public settings:SettingsService, private adminsService:AdminsService,
              private tools:RzhtoolsService,private router:Router,
              private route:ActivatedRoute,  private systemService:SysPlatformService,
              private addOrgan:AddorganService,private patterns: PatternService,
              private adminsComponent:AdminsComponent,private addAdminService:AddAdminService) {
    this.settings.showRightPage("28%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnChanges(changes:SimpleChanges):void {
    console.log("█ changes ►►►", changes);
  }

  // ng2Select
  public Role: Array<object> = [{id:"1",text:"第一个option"},{id:"2",text:"第二个option"}];
  public Group: Array<object> = [{id:"1",text:"第一个组"},{id:"2",text:"第二个组"}];

  public value: any = {};
  public _disabledV: string = '0';
  public disabled: boolean = false;

  public get disabledV(): string {
    return this._disabledV;
  }

  public set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selectedRole(value: any): void {
    console.log('Selected value is: ', value);
  }
  public selectedGroup(value: any): void {
    console.log('Selected value is: ', value);
  }

  public removedRole(value: any): void {
    console.log('Removed value is: ', value);
  }
  public removedGroup(value: any): void {
    console.log('Removed value is: ', value);
  }

  public typed(value: any): void {
    console.log('New search input: ', value);
  }

  public refreshValueRole(value: any): void {
    this.value = value;
  }
  public refreshValueGroup(value: any): void {
    this.value = value;
  }


  ngOnInit() {
    //获取当前路由
    this.route.url.subscribe(urls => {
      this.path = urls[0].path;
      console.log("█ this.path ►►►", this.path);
      switch (this.path) {
        //新增管理员
        case "addAdmin":
          console.log("█ \"新增管理员\" ►►►", "新增管理员");
          this.pageTitle = "新增管理员";
          this.Admin = true;
          break;

        //查看管理员信息
        case "adminDetail":
          console.log("█ \"查看管理员信息\" ►►►", "查看管理员信息");
          this.adminDetail = true;//属于查看详情，需要隐藏可编辑表单
          this.pageTitle = "管理员信息";
          this.getMgrCode();//获取管理员代码(路由参数)
          this.admin = this.addAdminService.getAdminDetail(this.admin['mgrCode'])//获取某个管理员详情
          break;

        //修改管理员信息
        case "updateAdmin":
          console.log("█ \"修改管理员信息\" ►►►", "修改管理员信息");
          this.pageTitle = "修改管理员信息";
          this.Admin = true;
          this.getMgrCode();//获取系统代码(路由参数)
          this.admin = this.addAdminService.getAdminDetail(this.admin['mgrCode'])//获取某个管理员详情
          this.admin['orgName'] = this.getOrgNameByCode(this.admin['orgCode']);//根据机构编码获取某个机构名字
          break;

        //修改管理员密码
        case "updatePwd":
          console.log("█ \"修改管理员密码\" ►►►", "修改管理员密码");
          this.pageTitle = "修改密码";
          this.updatePwd = true;
          this.getMgrCode();//获取管理员编码(路由参数)
          this.admin = this.addAdminService.getAdminDetail(this.admin['mgrCode'])//获取某个管理员详情
          break;

        //为管理员分配角色或角色组
        case "allotRole":
          console.log("█ \"分配角色或角色组\" ►►►", "分配角色或角色组");
          this.pageTitle = "分配角色或角色组";
          this.allotRoleOrGroup = true;
          this.getMgrCode();//获取管理员编码(路由参数)
          this.admin = this.addAdminService.getAdminDetail(this.admin['mgrCode'])//获取某个管理员详情
          this.systems = this.systemService.getSystemList();//系统列表
          break;
      }
    });

  }


  private selectedChange(){
    this.tempList = this.addAdminService.getRoleList(this.sysCode);
    let items = [],obj = {};
    for (var i=0; i<this.tempList.length; i++){
      obj = {
        id:this.tempList[i].roleCode,
        text:this.tempList[i].roleName
      };
      items.push(obj);
    }
    this.Role = items;
    console.log("█ this.Role ►►►",  this.Role);
  }


  //获取系统代码(路由参数)
  private getMgrCode() {
    this.route.params.subscribe(params => {
      this.admin['mgrCode'] = params['mgrCode'];
    });
  }

  private getOrgNameByCode(orgCode) {
    return this.addOrgan.getOrgDetailByCode(this.admin['orgCode']).orgName;
  }

  //获取区域数据
  getAreaData(area) {
    console.log("█ area ►►►", area);
    this.admin['areaCode'] = area.areaCode;
  }

  //从子组件获取所选机构数据
  getOrganCode(orgCode) {
    console.log("█ orgCode ►►►", orgCode);
    this.admin['orgCode'] = orgCode;
  }

  /**
   * 转换时间
   * @param time
   */
  switchTime(time) {
    //let me = this,normTime = me.settings.switchTime(time);
    console.log("█ normTime ►►►", time);
    return time;
  }

  /**
   * 将状态码转成状态名
   * @param stateKey
   */
  switchState(stateKey) {
    console.log("█ stateKey ►►►",  stateKey);
  }

  /**
   * 根据区域编码显示区域名
   * @param areaCode
   */
  private showAreaName(areaCode) {
    let me = this;
    let areaName = me.tools.getAreaByCode(areaCode).fullName;
    return areaName;
  }

  //从详情去修改
  private toUpdateAdmin() {
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.router.navigate(['/main/system/admins/updateAdmin', this.admin['mgrCode']], {replaceUrl: true});
  }


  //提交表单
  private submitAdminData() {
    let me = this;
    let submitUrl, submitData;
    submitUrl = '/sys/add';
    submitData = me.admin;
    switch (this.path) {
      //添加系统
      case "addAdmin":
        submitUrl = '/orgManager/add';
        break;
      case "updateAdmin":
        submitUrl = '/orgManager/update';
        break;
      case "updateState":
        submitData = {
          mgrCode: me.admin['mgrCode'],
          state: me.admin['state']
        };
        submitUrl = '/orgManager/updateState';
        break;
      case "updatePwd":
        submitData = {
          mgrCode: me.admin['mgrCode'],
          newpwd: me.admin['newpwd']
        };
        submitUrl = '/orgManager/updatePwdForSuper';
        break;
    }
    console.log("█ submitData ►►►", submitData);
    me.addAdminService.submitRightPageData(submitUrl, submitData);
    me.adminsComponent.ngOnInit()
  }

  // 取消
  private cancel() {
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }
}
