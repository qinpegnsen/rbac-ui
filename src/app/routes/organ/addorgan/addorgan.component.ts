
import 'rxjs/add/operator/switchMap';
import { Component, Input, Output, OnInit } from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {PatternService} from "../../../core/forms/pattern.service";
import {AddorganService} from "./addorgan.service";
import {AddAdminService} from "../../system/add-admin/add-admin.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {isNullOrUndefined} from 'util';
import {OrganComponent} from "../organ/organ.component";
import {SysPlatformService} from "../../system/sys-platform/sys-platform.service";

const swal = require('sweetalert');

@Component({
  selector: 'app-addorgan',
  templateUrl: './addorgan.component.html',
  styleUrls: ['./addorgan.component.scss'],
  providers: [AddorganService,AddAdminService,RzhtoolsService,SysPlatformService]
})
export class AddorganComponent implements OnInit {

  constructor(private patterns: PatternService,private tools: RzhtoolsService,private _parent:OrganComponent,
              public settings: SettingsService,private addAdminService: AddAdminService,private systemService:SysPlatformService,
              private route: ActivatedRoute, private router:Router, private addOrganService: AddorganService) {
    this.settings.showRightPage("28%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  private orgTypes:any;//机构类型，选择类型时需要
  private orgStates:any;//机构类型
  private organ = {};//机构

  private orgCode: string;//机构编码
  private systems: any;//系统列表
  private sysCode: string;//系统编码，分配角色或角色组时选择系统
  private path: string;//路由
  private pageTitle:string;右弹窗标题

  private Organ:boolean = false;//是否是添加或修改机构
  private detail:boolean = false;//是否是查看详情
  private updateType:boolean = false;//是否是修改机构类型
  private updateBoss:boolean = false;//是否是修改机构负责人
  private addRolesRelation:boolean = false;//是否是分配角色或角色组

  // ng2Select start
  private Role: Array<object>;//角色数组
  private Group: Array<object>;//角色组数组
  private selectedRoleStr:string;//已选角色拼接字符串
  private selectedGroupStr:string;//已选角色组拼接字符串

  private value:any = [];

  private refreshValueRole(value: any): void {
    this.selectedRoleStr = this.itemsToString(value);
    //console.log("█ this.selectedRoleStr ►►►",  this.selectedRoleStr);
  }
  private refreshValueGroup(value: any): void {
    this.selectedGroupStr = this.itemsToString(value);
    //console.log("█ this.selectedGroupStr ►►►",  this.selectedGroupStr);
  }

  /**
   * 将已经选择的角色或组的编码拼成字符串
   * @param value
   * @returns {string}
     */
  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.id;
      }).join(',');
  }
  // ng2Select end

  ngOnInit() {
    this.organ['type'] = '';//初始化，为了让select框默认选中value=''的option
    this.organ['state'] = '';//初始化，为了让select框默认选中value=''的option


    //获取当前路由
    this.route.url.subscribe(urls => {
      this.path = urls[0].path;
      //console.log("█ this.path ►►►",  this.path);
      switch(this.path){
        //添加机构
        case "addOrgan":
          //console.log("█ \"添加机构\" ►►►",  "添加机构");
          this.pageTitle = "添加机构";
          this.Organ = true;
          this.orgTypes = this.addOrganService.getOrgTypes(); //获取机构类型
          break;

        //查看机构详情
        case "orgDetail":
          //console.log("█ \"查看机构详情\" ►►►",  "查看机构详情");
          this.detail = true;//属于查看详情，需要隐藏可编辑表单
          this.pageTitle = "机构详情";
          this.getOrgCode();  //获取机构代码orgCode
          this.organ = this.addOrganService.getOrgDetailByCode(this.orgCode);  //通过orgCode获取机构详细信息
          break;

        //修改机构信息
        case "updateOrgan":
          //console.log("█ \"修改机构信息\" ►►►",  "修改机构信息");
          this.Organ = true;
          this.pageTitle = "修改机构信息";
          this.orgTypes = this.addOrganService.getOrgTypes(); //获取机构类型列表
          this.getOrgCode();  //获取机构代码orgCode
          this.organ = this.addOrganService.getOrgDetailByCode(this.orgCode);  //通过orgCode获取机构详细信息
          break;

        //修改机构负责人
        case "updateBoss":
          //console.log("█ \"修改机构负责人\" ►►►",  "修改机构负责人");
          this.updateBoss = true;
          this.pageTitle = "修改机构负责人";
          this.getOrgCode();  //获取机构代码orgCode
          this.organ = this.addOrganService.getOrgDetailByCode(this.orgCode);  //通过orgCode获取机构详细信息
          break;

        //修改机构类型
        case "updateType":
          //console.log("█ \"修改机构类型\" ►►►",  "修改机构类型");
          this.updateType = true;
          this.pageTitle = "修改机构类型";
          this.orgTypes = this.addOrganService.getOrgTypes(); //获取机构类型列表
          this.getOrgCode();  //获取机构代码orgCode
          this.organ = this.addOrganService.getOrgDetailByCode(this.orgCode);  //通过orgCode获取机构详细信息
          break;

        //添加角色或角色组
        case "allotRole":
          //console.log("█ \"添加角色或角色组\" ►►►",  "添加角色或角色组");
          this.addRolesRelation = true;
          this.pageTitle = "添加角色或角色组";
          this.getOrgCode();  //获取机构代码orgCode
          this.organ = this.addOrganService.getOrgDetailByCode(this.orgCode);  //通过orgCode获取机构详细信息
          this.systems = this.systemService.getSystemList();//系统列表
          break;
      }
    });
  }

  /**
   * 当选择的系统改变的时候
   */
  private selectedChange(){
    this.getRoleList();//获取角色列表
    this.getRoleGroupList();//获取角色组列表
  }

  /**
   * 获取角色列表
   */
  private getRoleList(){
    let oldArray = this.addAdminService.getRoleList(this.sysCode);
    let newArray = [],obj = {};
    for (var i=0; i<oldArray.length; i++){
      obj = {
        id:oldArray[i].roleCode,
        text:oldArray[i].roleName
      };
      newArray.push(obj);
    }
    this.Role = newArray;
    //console.log("█ this.Role ►►►",  this.Role);
  }

  /**
   * 获取角色组列表
   */
  private getRoleGroupList(){
    let oldArray = this.addAdminService.getRoleGroupList(this.sysCode);
    let newArray = [],obj = {};
    for (var i=0; i<oldArray.length; i++){
      obj = {
        id:oldArray[i].roleGroupCode,
        text:oldArray[i].roleGroupName
      };
      newArray.push(obj);
    }
    this.Group = newArray;
    //console.log("█ this.Group ►►►",  this.Group);
  }


  //获取机构代码(路由参数)
  private getOrgCode(){
    let me = this;
    me.route.params.subscribe(params => {
      me.orgCode = params['orgCode'];
    });
  }

  //获取区域数据
  private getAreaData(area){
    //console.log("█ area ►►►",  area);
    let me = this;
    me.organ['areaCode'] = area.areaCode;
  }

  //从详情去修改
  private toUpdateOrgan(){
    let me = this;
    me.settings.closeRightPage(); //关闭右侧滑动页面
    me.router.navigate(['/main/organ/updateOrgan',this.orgCode], { replaceUrl: true });
  }

  //提交机构form
  private submitOrganData(){
    let me = this;
    let submitUrl,submitData;
    switch(this.path){
      //添加机构
      case "addOrgan":
        if(isNullOrUndefined(me.organ['areaCode'])){
          swal('请选择区域', '区域参数必填', 'error');
          return
        }
        submitUrl = '/organ/add';
        submitData = me.organ;
        break;
      //修改机构信息
      case "updateOrgan":
        submitUrl = '/organ/update';
        submitData = me.organ;
        submitData.orgCode = me.orgCode;
        break;
      //修改机构负责人
      case "updateBoss":
        submitUrl = '/organ/updateBoss';
        submitData = {
          "orgCode":me.orgCode,
          "orgBoss": me.organ['orgBoss'],
          "bossPhone": me.organ['bossPhone']
        };
        break;
      //修改机构类型
      case "updateType":
        submitUrl = '/organ/updateType';
        submitData = {
          "orgCode":me.orgCode,
          "type": me.organ['type']
        };
        break;
      //添加角色或角色组
      case "allotRole":
        submitUrl = '/organ/addRolesRelation';
        if(me.selectedRoleStr == '' && me.selectedGroupStr == ''){
          swal('信息不完善', '角色和角色组编码不能同时为空', 'info');
          return;
        };
        submitData = {
          "orgCode":me.orgCode,
          "roleCodes": me.selectedRoleStr,
          "roleGroupCodes": me.selectedGroupStr
        };
        break;
    }
    //console.log("█ submitData ►►►",  submitData);
    me.addAdminService.submitRightPageData(submitUrl,submitData);//所有表单提交用的都是AddAdminService里的submitRightPageData方法
    me._parent.ngOnInit();//刷新父页面数据
  }

  // 取消
  cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面,返回上级路由
  }

}
