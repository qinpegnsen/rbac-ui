import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SettingsService} from '../../../core/settings/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
import { Location }from '@angular/common';
const swal = require('sweetalert');
@Component({
  selector: 'app-rightpage',
  templateUrl: './rightpage.component.html',
  styleUrls: ['./rightpage.component.scss']
})

export class RightpageComponent implements OnInit {
  private queryId:number;
  private sysCode:string;
  private roleGroupCode:string;
  private roleGroupName:string;
  private roleCode:string;
  private roleName:string;
  public orgData;
  public roleListData;
  public sysData;
  // 构造 初始化
  constructor(public settings: SettingsService,private router:Router,private ajax: AjaxService, private routeInfo: ActivatedRoute,private Location: Location) {
      this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {
    //根据id的不同呈现不同的页面
    this.queryId=this.routeInfo.snapshot.queryParams['id']

    this.sysCode=this.routeInfo.snapshot.queryParams['sysCode']
    //修改角色组要获取的参数
    this.roleGroupCode=this.routeInfo.snapshot.queryParams['roleGroupCode']
    this.roleGroupName=this.routeInfo.snapshot.queryParams['roleGroupName']
    //修改角色要获取的参数
    this.roleCode=this.routeInfo.snapshot.queryParams['roleCode']
    this.roleName=this.routeInfo.snapshot.queryParams['roleName']

    //获取系统列表的信息
    this.ajax.get({
      url: '/sys/list',
      data: {
        'sysName': ''
      },
      success: (data) => {
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

    //初始化的时候获取当前机构的所有的角色列表
    this.ajax.get({
      url: '/role/list',
      data: {
        sysCode:this.sysCode
      },
      success: (data) => {
        this.roleListData=data;
        console.log(data)
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

  //根据路由参数的不同，加载不同的页面，调取不同的接口
  updateMssage(value){
    console.log(value)
    if(this.queryId==1){//新增角色组
      this.ajax.post({
        url: '/roleGroup/add',
        data: {
          'sysCode':value.sysCode ,
          'sysName': value.sysName,
          'orgCode': value.orgCode,
          'roleGroupName': value.roleGroupName,
          'remarks':value.remarks
        },
        success: (data) => {
          // this.dialogSuccess()
          swal('成功提醒', '成功，状态：success', 'success');
          console.log("新增角色组成功")
        },
        error: (data) => {
          console.log("新增角色组失败");
        }
      });
    }else if(this.queryId==2){ //新增角色
      this.ajax.post({
        url: '/role/add',
        data: {
          'sysCode':value.sysCode ,
          'sysName': value.sysName,
          'orgCode': value.orgCode,
          'roleName': value.roleName,
          'remarks':value.remarks
        },
        success: (data) => {
          console.log(data)
        },
        error: (data) => {
          console.log(value.sysName)
          console.log("error");
        }
      });
    }else if(this.queryId==4){ //修改角色组
      this.ajax.put({
        url: '/roleGroup/update',
        data: {
          'roleGroupCode':this.roleGroupCode ,
          'roleGroupName': value.roleGroupName,
          'remarks': value.orgCode
        },
        success: (data) => {
          console.log(data)
          swal('成功提醒', '成功，状态：success', 'success');
        },
        error: (data) => {
          console.log("修改角色组失败");
        }
      });
    }else if(this.queryId==5){ //修改角色
      this.ajax.put({
        url: '/role/update',
        data: {
          'roleCode':this.roleCode ,
          'roleName':this.roleName ,
          'remarks': value.remarks
        },
        success: (data) => {
          console.log(data)
        },
        error: (data) => {
          console.log("error");
        }
      });
    }
  }

}
