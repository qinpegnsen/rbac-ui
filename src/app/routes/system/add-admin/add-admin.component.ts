import { Component, OnInit } from '@angular/core';
import { Location }from '@angular/common';
import {AjaxService} from "../../../core/services/ajax.service";
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {isNull} from "util";
const swal = require('sweetalert');

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {
  private pageTitle:string = '';
  private path: string;
  private Admin:boolean = false;
  private adminDetail:boolean = false;
  private updatePwd:boolean = false;
  private adminStates:string;
  private adr:string = '';
  private newpwd:string;
  private admin = {
    mgrCode: '',
    orgName:'',
    orgCode: '',
    areaCode: '',
    phone: '',
    mgrName: '',
    idcard: '',
    loginCode: '',
    pwd: '',
    avatar: '',
    home: '',
    state: '',
    newpwd:''
  }

  constructor(private ajax: AjaxService,public settings: SettingsService,
              private route: ActivatedRoute, private router:Router,
              private Location: Location) {
    this.settings.showRightPage("28%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {
    //获取当前路由
    this.route.url.subscribe(urls => {
      this.path = urls[0].path;
      console.log("█ this.path ►►►",  this.path);
      switch(this.path) {
        //新增管理员
        case "addAdmin":
          console.log("█ \"新增管理员\" ►►►",  "新增管理员");
          this.pageTitle = "新增管理员";
          this.Admin = true;
          break;

        //查看管理员信息
        case "adminDetail":
          console.log("█ \"查看管理员信息\" ►►►",  "查看管理员信息");
          this.adminDetail = true;//属于查看详情，需要隐藏可编辑表单
          this.pageTitle = "管理员信息";
          this.getMgrCode();//获取管理员代码(路由参数)
          this.getAdminDetail()//获取某个管理员详情
          break;

        //修改管理员信息
        case "updateAdmin":
          console.log("█ \"修改管理员信息\" ►►►",  "修改管理员信息");
          this.pageTitle = "修改管理员信息";
          this.Admin = true;
          this.getMgrCode();//获取系统代码(路由参数)
          this.getAdminDetail()//获取某个管理员详情
          this.getOrgDetailByCode();
          break;

        //修改管理员密码
        case "updatePwd":
          console.log("█ \"修改管理员密码\" ►►►",  "修改管理员密码");
          this.pageTitle = "修改密码";
          this.updatePwd = true;
          this.getMgrCode();//获取管理员编码(路由参数)
          this.getAdminDetail()//获取某个管理员详情
          break;
      }
    });

  }

  //获取系统代码(路由参数)
  private getMgrCode(){
    this.route.params.subscribe(params => {
      this.admin.mgrCode = params['mgrCode'];
    });
  }

  //获取区域数据
  getAreaData(area){
    console.log("█ area ►►►",  area);
    this.admin.areaCode = area.areaCode;
  }

  //从子组件获取所选机构数据
  getOrganCode(orgCode){
    console.log("█ orgCode ►►►",  orgCode);
    this.admin.orgCode = orgCode;
  }

  //转换时间
  switchTime(time){
    if(!isNull(time)){
      return new Date(parseInt(time)).toLocaleString('chinese',{hour12:false});
    }else{
      return ''
    }
  }

  //从详情去修改
  private toUpdateAdmin(){
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.router.navigate(['/main/system/admins/updateAdmin',this.admin.mgrCode], { replaceUrl: true });
  }

  //获取某个系统详情
  private getAdminDetail(){
    this.ajax.get({
      url: '/orgManager/load',
      data:{
        mgrCode: this.admin.mgrCode
      },
      success: (res) => {
        if(res.success){
          this.admin = res.data;
          console.log("█ res ►►►",  res);
        }
      },
      error: (res) => {
        console.log("get systemDetail error");
      }
    });
  }

  //通过orgCode获取机构详细信息
  private getOrgDetailByCode(){
    this.ajax.get({
      url: '/organ/load',
      data:{
        orgCode: this.admin.orgCode
      },
      success: (res) => {
        if(res.success){
          this.admin.orgName = res.data.orgName;
          console.log("█ this.admin.orgName ►►►", this.admin.orgName);
        }
      },
      error: (res) => {
        console.log("get orgTypes error");
      }
    });
  }

  //提交表单
  private submitAdminData(){
    let me = this;
    let submitUrl,submitData;
    submitUrl = '/sys/add';
    submitData = me.admin;
    switch(this.path) {
      //添加系统
      case "addAdmin":
        submitUrl = '/orgManager/add';
        break;
      case "updateAdmin":
        submitUrl = '/orgManager/update';
        break;
      case "updateState":
        submitData = {
          mgrCode: me.admin.mgrCode,
          state: me.admin.state
        };
        submitUrl = '/orgManager/updateState';
        break;
      case "updatePwd":
        submitData = {
          mgrCode: me.admin.mgrCode,
          newpwd: me.admin.newpwd
        };
        submitUrl = '/orgManager/updatePwdForSuper';
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
        console.log("post system error");
      }
    })
  }

  //获取管理员状态列表
  private getAdminStateList(){
    this.ajax.get({
      url: '/orgManager/statelist',
      success: (res) => {
        this.adminStates = res;
        console.log("█ res ►►►",  res);
      },
      error: (res) => {
        console.log("getAdminStateList error");
      }
    });
  }

  // 取消
  private cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }
}
