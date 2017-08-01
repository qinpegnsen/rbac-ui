
import 'rxjs/add/operator/switchMap';
import { Component, Input, Output, OnInit } from '@angular/core';
import { Location }from '@angular/common';
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {PatternService} from "../../../core/forms/pattern.service";


const swal = require('sweetalert');
/*interface AddOrganData{
  orgName: string;
  areaCode: string;
  tel: string;
  orgBoss: string;
  type: string;
  adr?: string;
  bossPhone?: string;
  duty?: string;
  remarks?: string;
  orgLogo?: string;
  preCode?: string;
}*/

@Component({
  selector: 'app-addorgan',
  templateUrl: './addorgan.component.html',
  styleUrls: ['./addorgan.component.scss'],
  providers: [RzhtoolsService,PatternService,Location]
})
export class AddorganComponent implements OnInit {
  private orgTypes:any;
  private orgStates:any;
  private organ = {
    orgName: '',
    areaCode: '',
    tel: '',
    orgBoss: '',
    type: '',
    adr: '',
    bossPhone: '',
    duty: '',
    remarks: '',
    orgLogo: '',
    state: '',
    crTime: '',
    upTime: ''
  }

  private orgCode: string;
  private roleGroupCode: string = '';
  private roleCode: string = '';
  private show: boolean = false;
  private areas: any;
  private path: string;
  private pageTitle:string;

  private addOrgan:boolean = false;
  private detail:boolean = false;
  private updateOrgan:boolean = false;
  private updateState:boolean = false;
  private updateType:boolean = false;
  private updateBoss:boolean = false;
  private addRolesRelation:boolean = false;
  private role:boolean = true;

  //@Output() outputvalue = new EventEmitter<boolean>();

  constructor(private ajax: AjaxService, private area: RzhtoolsService,
              private pattern: PatternService, public settings: SettingsService,
              private route: ActivatedRoute, private router:Router,
              private Location: Location) {
    this.settings.showRightPage("28%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {

    //获取当前路由
    this.route.url.subscribe(urls => {
      this.path = urls[0].path;
      console.log("█ this.path ►►►",  this.path);
      switch(this.path){
        //添加机构
        case "addOrgan":
          //console.log("█ \"添加机构\" ►►►",  "添加机构");
          this.pageTitle = "添加机构";
          this.addOrgan = true;
          this.getOrgTypes(); //获取机构类型
          break;

        //查看机构详情
        case "orgDetail":
          //console.log("█ \"查看机构详情\" ►►►",  "查看机构详情");
          this.detail = true;//属于查看详情，需要隐藏可编辑表单
          this.pageTitle = "机构详情";
          this.getOrgCode();  //获取机构代码orgCode
          this.getOrgDetailByCode();  //通过orgCode获取机构详细信息
          break;

        //修改机构信息
        case "updateOrgan":
          //console.log("█ \"修改机构信息\" ►►►",  "修改机构信息");
          this.updateOrgan = true;
          this.pageTitle = "修改机构信息";
          this.getOrgTypes(); //获取机构类型列表
          this.getOrgCode();  //获取机构代码orgCode
          this.getOrgDetailByCode();  //通过orgCode获取机构详细信息
          break;

        //修改机构负责人
        case "updateBoss":
          //console.log("█ \"修改机构负责人\" ►►►",  "修改机构负责人");
          this.updateBoss = true;
          this.pageTitle = "修改机构负责人";
          this.getOrgCode();  //获取机构代码orgCode
          this.getOrgDetailByCode();  //通过orgCode获取机构详细信息
          break;

        //修改机构类型
        case "updateType":
          //console.log("█ \"修改机构类型\" ►►►",  "修改机构类型");
          this.updateType = true;
          this.pageTitle = "修改机构类型";
          this.getOrgTypes(); //获取机构类型列表
          this.getOrgCode();  //获取机构代码orgCode
          this.getOrgDetailByCode();  //通过orgCode获取机构详细信息
          break;

        //修改机构状态
        case "updateState":
          //console.log("█ \"修改机构状态\" ►►►",  "修改机构状态");
          this.updateState = true;
          this.pageTitle = "修改机构状态";
          this.getOrgStates(); //获取机构状态列表
          this.getOrgCode();  //获取机构代码orgCode
          this.getOrgDetailByCode();  //通过orgCode获取机构详细信息
          break;

        //添加角色或角色组
        case "addRolesRelation":
          //console.log("█ \"添加角色或角色组\" ►►►",  "添加角色或角色组");
          this.addRolesRelation = true;
          this.pageTitle = "添加角色或角色组";
          this.getOrgCode();  //获取机构代码orgCode
          this.getOrgDetailByCode();  //通过orgCode获取机构详细信息
          break;
      }
    });
  }

  //获取机构代码(路由参数)
  getOrgCode(){
    this.route.params.subscribe(params => {
      this.orgCode = params['orgCode'];
    });
  }

  //从详情去修改
  toUpdateOrgan(){
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.router.navigate(['/main/organ/updateOrgan',this.orgCode], { replaceUrl: true });
  }

  //获取机构类型
  getOrgTypes(){
    this.ajax.get({
      url: '/organ/typelist',
      success: (res) => {
        this.orgTypes = res;
        console.log("█ res ►►►",  res);
      },
      error: (res) => {
        console.log("get orgTypes error");
      }
    });
  }

  //获取机构状态
  getOrgStates(){
    this.ajax.get({
      url: '/organ/statelist',
      success: (res) => {
        this.orgStates = res;
        console.log("█ res ►►►",  res);
      },
      error: (res) => {
        console.log("get orgStates error");
      }
    });
  }

  //通过orgCode获取机构详细信息
  getOrgDetailByCode(){
    this.ajax.get({
      url: '/organ/load',
      data:{
        orgCode: this.orgCode
      },
      success: (res) => {
        if(res.success){
          this.organ = res.data;
        }
      },
      error: (res) => {
        console.log("get orgTypes error");
      }
    });
  }

 // 获取地区列表
 getArea(fullName,myAreaCode,isOld){
   let me = this;
   me.show = true;
   me.areas = me.area.getAreaByCode(myAreaCode,isOld).children;
   me.organ.adr = fullName;
   me.organ.areaCode = myAreaCode;
   if (me.areas == undefined){
     me.cityConfirm();
   }
     console.log(me.areas)
 }

  //显示城市选择器并获取省级列表
  showSelectArea(){
    let me = this;
    if(me.show) return;
    me.show = true;
    me.areas = me.area.getAreaByCode('');
  }

  //重置城市信息
  freshCitys(){
    this.areas = this.area.getAreaByCode('');
  }

  //确定选择城市
  cityConfirm(){
    this.show = false;
  }

  //提交机构form
  submitOrganData(){
    let me = this;
    let submitUrl,submitData;
    switch(this.path){
      //添加机构
      case "addOrgan":
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
          "orgBoss": me.organ.orgBoss,
          "bossPhone": me.organ.bossPhone
        };
        break;
      //修改机构类型
      case "updateType":
        submitUrl = '/organ/updateType';
        submitData = {
          "orgCode":me.orgCode,
          "type": me.organ.type
        };
        break;
      //修改机构状态
      case "updateState":
        submitUrl = '/organ/updateState';
        submitData = {
          "orgCode":me.orgCode,
          "state": me.organ.state
        };
        break;
      //添加角色或角色组
      case "addRolesRelation":
        submitUrl = '/organ/addRolesRelation';
        if(me.roleCode == '' && me.roleGroupCode == ''){
          swal('信息不完善', '角色和角色组编码不能同时为空', 'info');
          return;
        };
        submitData = {
          "orgCode":me.orgCode,
          "roleCode": me.roleCode,
          "roleGroupCode": me.roleGroupCode
        };
        break;
    }
    console.log("█ submitData ►►►",  submitData);
    me.ajax.post({
      url: submitUrl,
      data: submitData,
      success: (res) => {
        console.log("█ res ►►►",  res);
        if (res.success){
          this.cancel(); //路由跳转
          swal({
            title: '提交成功!',
            text: '列表已自动更新',
            type: 'success',
            timer: 2000, //关闭时间，单位：毫秒
            showConfirmButton: false  //不显示按钮
          });
          //this.outputvalue.emit(true);//提交成功后向父组件传值
        }else{
          let errorMsg = res.data.substring(res.data.indexOf('$$')+2,res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post organ error");
      }
    })
  }

  // 取消
  cancel(){
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.Location.back();
    this.router.navigate(['/main/organ']);
  }

}
