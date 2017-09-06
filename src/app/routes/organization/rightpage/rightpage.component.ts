import { Component, OnInit, ViewChild } from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import {ActivatedRoute,Router} from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
import {AppStore} from "../store/app-store";
const swal = require('sweetalert');
import {Store} from "@ngrx/store";
import {OrgService} from "../server/org.service";
import {TableComponent} from "../table/table.component";
import {BindRoleService} from "./bind-role.service";
import {SelectComponent} from "ng2-select/index";
import {isArray} from "rxjs/util/isArray";
@Component({
  selector: 'app-rightpage',
  templateUrl: './rightpage.component.html',
  styleUrls: ['./rightpage.component.scss'],
  providers: [BindRoleService]
})
export class RightpageComponent implements OnInit {
  private queryId:number;//获取添加，修改的ID
  public deptCode:string;//获取部门编码
  public staffCode:string;//获取员工编码
  public staffCodes:string;
  private limitForm = {
    deptCode:'',
    deptName: ''
  }
  private  staff= {}
  private  dept= {}

  private sysCode: string;//新增角色组，绑定角色用到，根据系统的的编码呈现当前的系统的名字

  public sysData;//系统列表的数据
  public roleGroupCode;//角色组列表的数据
  public roleCode;//角色列表的数据
  public orgEmpExtVOList;
  private _staffList: any; // 员工列表
  private fileName:string = '选择图片';
  private myImg: any;

  @ViewChild('defaultRole') public mySelectRoles: SelectComponent;//设置默认选中的角色
  @ViewChild('defaultGroup') public mySelectGroup: SelectComponent;//设置默认选中的角色组

  constructor(
    private ajax:AjaxService,
    public settings: SettingsService,
    private router:Router,
    private org:OrgService,
    private store: Store<AppStore>,
    private routeInfo:ActivatedRoute,
    private bindRoleService:BindRoleService

  ) {
    this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  // ng2Select
  public Role: Array<object>;
  public Group: Array<object>;

  private value:any = [];

  public refreshValueRole(value: any): void {
    this.roleCode = this.itemsToString(value);
  }
  public refreshValueGroup(value: any): void {
    this.roleGroupCode = this.itemsToString(value);
  }
  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.id;
      }).join(',');
  }



  ngOnInit() {

    // 获取deptCode部门编码
    this.store.select('addStaff').subscribe((res) => {
      this.deptCode = res[0].deptCode;
    });
    //获取路由的参数
    this.queryId = this.routeInfo.snapshot.queryParams['id'];
    // 获取staffCode员工编码
    this.staffCode = this.routeInfo.snapshot.queryParams['staffCode'];
    // 获取系统编码编码
    this.sysCode = this.routeInfo.snapshot.queryParams['sysCode'];// 获取系统编码编码

    this.store.select('staff').subscribe((item) => {
      const arr = [];
      this._staffList = item;
      this.orgEmpExtVOList = item as Array<any>;
      let len = isArray(this.orgEmpExtVOList) ? this.orgEmpExtVOList.length : 0;
      for (let i = 0; i < len; i ++) {
        arr.push(this.orgEmpExtVOList[i].staffName);
      }
      this.orgEmpExtVOList = arr;
    })
    /**
     * 部门设置右边栏显示部门名称
     */
    if(this.queryId == 1){
      this.store.select('active').subscribe((res) => {
        this.limitForm.deptName = res as string;
      });
    }


    /**
     * 请求详细数据，并显示(员工信息)
     */
    if(typeof(this.staffCode) != 'undefined') {
      this.ajax.get({
        url: '/staff/load',
        async: false, //同步请求
        data: {staffCode: this.staffCode},
        success: (res) => {
          this.staff = res.data;
        },
        error: (res) => {
          console.log("post limit error");
        }
      });
    }

    /**
     * 请求详细数据，并显示(部门信息)
     */

   if(typeof(this.deptCode) != 'undefined') {
      this.ajax.get({
        url: '/dept/load',
        async: false, //同步请求
        data: {deptCode: this.deptCode},
        success: (res) => {
          this.dept = res.data;
        },
        error: (res) => {
          console.log("post limit error");
        }
      });
    }


    /**
     * 获取系统列表的信息
     */
    this.ajax.get({
      url: '/sys/listForStaff',
      data: {
        'sysName': ''
      },
      success: (data) => {
        this.sysData = data;
      },
      error: (data) => {
        console.log("error");
      }
    });

  }


  /**
   * 监听图片选择
   * @param $event
   */
  fileChangeListener($event) {
    let that = this;
    let image: any = new Image();
    let file: File = $event.target.files[0];
    that.fileName = file.name;
    let myReader: FileReader = new FileReader();
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.myImg = image.src;
    };
    myReader.readAsDataURL(file);
  }
  /**
   *为部门设置主管
   * @param data
     */
  /*refreshValueList(data: any) {
    this.staffCodes = '';
    console.log(this._staffList);
    for (let i = 0; i < data.length; i ++) {
      let len = isArray(this._staffList) ? this._staffList.length : 0;
      for (let j = 0; j < len; j ++) {
        if (this._staffList[j].staffName === data[i].text) {
          if (i !== data.length - 1) {
            this.staffCodes += this._staffList[j].staffCode + ',';
          } else {
            this.staffCodes += this._staffList[j].staffCode;
          }
        }
      }
    }
    console.log(this.staffCodes);
    console.log(data);
  }*/
  /**
   * 关闭子页面（取消）
   */
  cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }

  /**
   * 当选择系统时
   */
  private selectedChange(){
    this.getRoleAndGroupList();//获取角色/角色组列表
  }

  /**
   * 获取角色和角色组列表
   */
  private getRoleAndGroupList(){
    let roleAndGroupList = this.bindRoleService.getRoleAndGroupList(this.sysCode,this.staffCode).data;
    console.log("█ roleAndGroupList ►►►", roleAndGroupList);
    let oldRolesArray = roleAndGroupList.roleList;
    let oldRoleGroupArray = roleAndGroupList.roleGroupList;
    let newRolesArray = [], myNewRolesArray = [],myNewRoleGroupArray = [], newRoleGroupArray = [], obj = {};
    for (var i=0; i<oldRolesArray.length; i++){
      obj = {
        id:oldRolesArray[i].roleCode,
        text:oldRolesArray[i].roleName
      };
      newRolesArray.push(obj);
      if (oldRolesArray[i].isHas == 'Y'){
        myNewRolesArray.push(obj)
      }
    }
    for (var i=0; i<oldRoleGroupArray.length; i++){
      obj = {
        id:oldRoleGroupArray[i].roleGroupCode,
        text:oldRoleGroupArray[i].roleGroupName
      };
      newRoleGroupArray.push(obj);
      if (oldRoleGroupArray[i].isHas == 'Y'){
        myNewRoleGroupArray.push(obj)
      }
    }
    console.log('myNewRolesArray',myNewRolesArray)
    console.log('myNewRoleGroupArray',myNewRoleGroupArray)
    this.mySelectRoles.active = myNewRolesArray;
    this.mySelectGroup.active = myNewRoleGroupArray;

    this.Role = newRolesArray;
    this.Group = newRoleGroupArray;
  }

  /**
   * 添加(员工信息)
   * 修改员工密码
   * @param value
     */
  addLimitList(value){
    let _this = this;
    //添加员工信息
    if(_this.queryId == 3){
      _this.ajax.post({
        url: '/staff/add',
        data: {
          'deptCode': value.deptCode,
          'idcard': value.idcard,
          'phone': value.phone,
          'staffName': value.staffName,
          'loginCode': value.loginCode,
          'pwd': value.pwd,
          'home': value.home,
          'position': value.position
        },
        success: (res) => {
          if (res.success) {
            _this.router.navigate(['/main/organization'], {replaceUrl: true}); //路由跳转
            swal('添加员工提交成功！', '','success');
            _this.org.getOrgList('/staff/list?deptCode=' + value.deptCode).subscribe((res) => {
              _this.store.dispatch({type: 'STAFF_ADD', payload: res});

            })
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          swal('添加员工提交失败！', '','error');
        }
      })
    }
    //修改员工密码
    else if(_this.queryId == 4) {
      _this.ajax.post({
        url: '/staff/updatePwd',
        data: {
          'staffCode': value.staffCode,
          'newpwd': value.newpwd
        },
        success: (res) => {
          console.log(res)
          if (res.success) {
            _this.router.navigate(['main/organization'], {replaceUrl: true});   //路由跳转
            swal('修改密码成功！', '','success');
            //_this.outputvalue.emit(true);//提交成功后向父组件传值
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          swal('修改密码失败！', '','error');
        }
      });
    }
    //修改员工信息
    else if(_this.queryId == 5) {
      _this.ajax.post({
        url: '/staff/update',
        data: {
          'staffCode': value.staffCode,
          'idcard': value.idcard,
          'phone': value.phone,
          'staffName': value.staffName,
          'uuid': value.uuid,
          'home': value.home,
          'position': value.position
        },
        success: (res) => {
          console.log(res)
          if (res.success) {
            _this.router.navigate(['main/organization'], {replaceUrl: true});   //路由跳转
            swal('修改员工信息成功！', '','success');
            //_this.store.dispatch({type: 'LIST', payload: true});
            console.log("/staff/list?deptCode=" + value.deptCode);
             _this.store.select('addStaff').subscribe((res) => {
               _this.org.getOrgList('/staff/list?deptCode=' + res[0].deptCode).subscribe((res) => {
                 _this.store.dispatch({type: 'STAFF_ADD', payload: res});
               })
             });

          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          swal('修改员工信息失败！', '','error');
        }
      });
    }
    //添加部门
    else if(_this.queryId == 2) {
      _this.ajax.post({
        url: '/dept/add',
        data: {
          'preCode': this.deptCode,
          'deptName': value.deptName,
          'adr': value.adr,
          'duty': value.duty
        },
        success: (res) => {
          console.log(res)
          if (res.success) {
            _this.router.navigate(['main/organization'], {replaceUrl: true});   //路由跳转
            swal('添加部门成功！', '','success');
            //_this.outputvalue.emit(true);//提交成功后向父组件传值
            _this.store.dispatch({type: 'LIST', payload: true});
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          swal('添加部门失败！', '','error');
        }
      });
    }
    //为员工绑定角色角色组
    else if(_this.queryId == 6) {
      _this.ajax.post({
        url: '/staff/addRolesRelation',
        data: {
          'deptCode': this.deptCode,
          'staffCode': this.staffCode,
         'sysCode': this.sysCode,
          'roleCode': this.roleCode,
          'roleGroupCode': this.roleGroupCode
        },
        success: (res) => {
          console.log(res)
          if (res.success) {
            _this.router.navigate(['main/organization'], {replaceUrl: true});   //路由跳转
            swal('绑定角色角色组成功！', '','success');
            //_this.outputvalue.emit(true);//提交成功后向父组件传值
            // 通知home-p组件更新
            _this.store.dispatch({type: 'LIST', payload: true});
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          swal('绑定角色角色组失败！', '','error');
        }
      });
    }
    //修改部门信息
    else if(_this.queryId == 1) {
      _this.ajax.post({
        url: '/dept/update',
        data: {
          'deptCode': value.deptCode,
          'preCode': value.preCode,
          'deptName': value.deptName,
          'adr': value.adr,
          'duty': value.duty
        },
        success: (res) => {
          console.log(res)
          if (res.success) {
            _this.router.navigate(['main/organization'], {replaceUrl: true});   //路由跳转
            swal('修改部门信息成功！', '','success');

          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          swal('修改部门信息失败！', '','error');
        }
      });
    }
  }

}
