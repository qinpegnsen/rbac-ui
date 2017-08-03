import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AddAdminService} from "./add-admin.service";
import {AddorganService} from "../../organ/addorgan/addorgan.service";

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
  providers: [AddAdminService,AddorganService]
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

  constructor(public settings: SettingsService,
              private route: ActivatedRoute, private router:Router,private addOrgan:AddorganService,
              private addAdminService:AddAdminService) {
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
          this.admin = this.addAdminService.getAdminDetail(this.admin.mgrCode)//获取某个管理员详情
          break;

        //修改管理员信息
        case "updateAdmin":
          console.log("█ \"修改管理员信息\" ►►►",  "修改管理员信息");
          this.pageTitle = "修改管理员信息";
          this.Admin = true;
          this.getMgrCode();//获取系统代码(路由参数)
          this.admin = this.addAdminService.getAdminDetail(this.admin.mgrCode)//获取某个管理员详情
          this.admin.orgName = this.addOrgan.getOrgDetailByCode(this.admin.orgCode).orgName;//根据机构编码获取某个机构名字
          break;

        //修改管理员密码
        case "updatePwd":
          console.log("█ \"修改管理员密码\" ►►►",  "修改管理员密码");
          this.pageTitle = "修改密码";
          this.updatePwd = true;
          this.getMgrCode();//获取管理员编码(路由参数)
          this.admin = this.addAdminService.getAdminDetail(this.admin.mgrCode)//获取某个管理员详情
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

  /**
   * 转换时间
   * @param time
     */
  switchTime(time){
    let me = this,normTime = me.settings.switchTime(time);
    return normTime;
  }

  //从详情去修改
  private toUpdateAdmin(){
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.router.navigate(['/main/system/admins/updateAdmin',this.admin.mgrCode], { replaceUrl: true });
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
    me.addAdminService.submitRightPageData(submitUrl,submitData)
  }

  // 取消
  private cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }
}
