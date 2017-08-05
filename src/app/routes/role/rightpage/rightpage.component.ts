import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SettingsService} from '../../../core/settings/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
import { Location }from '@angular/common';
import {RoleComponent} from "../role/role.component";
import {RoleListComponent} from "../role-list/role-list.component";
const swal = require('sweetalert');
@Component({
  selector: 'app-rightpage',
  templateUrl: './rightpage.component.html',
  styleUrls: ['./rightpage.component.scss']
})

export class RightpageComponent implements OnInit {

  private queryId:number;
  private sysCode:string;
  private sysName:string;
  private roleGroupCode:string;
  private roleGroupName:string;
  private roleCode:string;
  private roleName:string;
  public orgData;
  public roleListData;
  public sysData;
  public roleCodes;
  public limitCodes;


  // 构造 初始化
  constructor(public settings: SettingsService,private router:Router,private ajax: AjaxService, private routeInfo: ActivatedRoute,private Location: Location,private roleComponent:RoleComponent,private roleListComponent:RoleListComponent) {
      this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {
    //根据id的不同呈现不同的页面
    this.queryId=this.routeInfo.snapshot.queryParams['id'];
    this.sysCode=this.routeInfo.snapshot.queryParams['sysCode'];
    this.sysName=this.routeInfo.snapshot.queryParams['sysName'];
    //修改角色组要获取的参数
    this.roleGroupCode=this.routeInfo.snapshot.queryParams['roleGroupCode'];
    this.roleGroupName=this.routeInfo.snapshot.queryParams['roleGroupName'];
    //修改角色要获取的参数
    this.roleCode=this.routeInfo.snapshot.queryParams['roleCode'];
    this.roleName=this.routeInfo.snapshot.queryParams['roleName'];


    //获取系统列表的信息
    this.ajax.get({
      url: '/sys/list',
      data: {
        'sysName': ''
      },
      success: (data) => {
        for(let i=0;i<data.length;i++){
          if(data[i].sysCode==this.sysCode){
            this.sysName=data[i].sysName
          }
        }
        this.sysData=data;
      },
      error: (data) => {
        console.log("error");
      }
    });

    //初始化的时候获取机构信息
    this.ajax.get({
      url: '/organ/list',
      data: {
        orgName:''
      },
      success: (data) => {
        this.orgData=data;
      },
      error: (data) => {
        console.log("error");
      }
    });

  }

  // 取消
  cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }
  //提交
  closePage(){
    if(this.queryId==5||this.queryId==4){
      this.settings.closeRightPage(); //关闭右侧滑动页面
      this.router.navigate(['/main/role/roleList']);
      this.roleListComponent.ngOnInit()
    }else{
      this.settings.closeRightPage(); //关闭右侧滑动页面
      this.router.navigate(['/main/role/roleGroup']);
      this.roleComponent.queryDatas();
    }
  }

  //获取到bing-role传递过来的角色编码集
  getRoleCodes(roleCodes){
    console.log(roleCodes)
   this.roleCodes=roleCodes;
  }
  //获取到传递过来的权限编码集
  getRoleLimit(limitCodes){
    this.limitCodes=limitCodes;
  }

  //根据路由参数的不同，加载不同的页面，调取不同的接口
  updateMssage(value){
    if(this.queryId==1){//新增角色组
      this.ajax.post({
        url: '/roleGroup/add',
        async:false,
        data: {
          'sysCode':value.sysCode ,
          'roleGroupName': value.roleGroupName,
          'remarks':value.remarks
        },
        success: (data) => {
          if(data.success){
            swal('新增角色组成功','','success');
          }else{
            swal('新增角色组失败','','success');
          }
        },
        error: (data) => {
          console.log("新增角色组失败");
        }
      });
    }else if(this.queryId==2){ //绑定角色
      this.ajax.post({
        url: '/roleGroup/addRelation',
        data: {
          'roleGroupCode':this.roleGroupCode ,
          'roleCodes':this.roleCodes
        },
        async:false,
        success: (data) => {
          if(data.success){
            swal('绑定角色成功','','success');
          }else{
            swal('绑定角色失败','','success');
          }
        },
        error: (data) => {
          console.log("绑定角色失败");
        }
      });
    }else if(this.queryId==3){ //修改角色组
      this.ajax.put({
        url: '/roleGroup/update',
        data: {
          'roleGroupCode':this.roleGroupCode ,//这里是通过路由传递过来的
          'roleGroupName':this.roleGroupName,
          'remarks': value.orgCode
        },
        async:false,
        success: (data) => {
          if(data.success){
            swal('修改角色组成功','','success');
          }else{
            swal('修改角色组失败','','success');
          }
        },
        error: (data) => {
          console.log("修改角色组失败");
        }
      });
    }else if(this.queryId==4){ //修改角色
      this.ajax.put({
        url: '/role/update',
        data: {
          'roleCode':this.roleCode ,
          'roleName':this.roleName ,
          'remarks': value.remarks
        },
        async:false,
        success: (data) => {
          if(data.success){
            swal('修改角色成功','','success');
          }else{
            swal('修改角色失败','','success');

          }
        },
        error: (data) => {
          console.log("修改角色失败");
        }
      });
    }else if(this.queryId==5){ //新增角色
      this.ajax.post({
        url: '/role/add',
        data: {
          'sysCode':this.sysCode ,
          'roleName':value.roleName,
          'remarks': value.remarks
        },
        async:false,
        success: (data) => {
          console.log(data.sysCode)
          if(data.success){
            swal('新增角色成功','','success');
          }else{
            swal('新增角色失败','','success');
          }
        },
        error: (data) => {
          console.log("修改角色失败");
        }
      });
    }else if(this.queryId==6){ //为角色分配权限
      this.ajax.post({
        url: '/role/addRelation',
        data: {
          'roleCode':this.roleCode,
          'limitCodes':this.limitCodes
        },
        async:false,
        success: (data) => {
          if(data.success){
            swal('分配权限成功','','success');
          }else{
            swal('分配权限失败','','success');
          }
        },
        error: (data) => {
          console.log("绑定角色失败");
        }
      });
    }
    this.closePage();//调用关闭页面的方法
  }

}
