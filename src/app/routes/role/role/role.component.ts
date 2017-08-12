import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {AjaxService} from "../../../core/services/ajax.service";
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {isNull} from "util";
import {ActivatedRoute} from "@angular/router";
import {RolemanComponent} from "../roleman/roleman.component";
const swal = require('sweetalert');
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})

export class RoleComponent implements OnInit {
  /**
   * 系统列表的接口
   * sysCode 初始化系统的编码，默认第一个，然后根据sysCode调用初始化的角色组列表和角色列表
   * sysList 系统列表的数据
   * sysName 系统下拉框里面的默认的文本
   */
  public sysList;
  public sysCode;
  public sysName="请先选择系统";

  /**
   * 3个button的按钮
   * addGroupButton 添加角色组的按钮
   *bingRoleButton  绑定角色按钮
   */
  private addGroupButton;
  private bingRoleButton;
  private updateButton;

  /**
   * 角色组点击的时候要传递给角色列表的属性
   * roleGroupNameText 默认呈现的title
   * roleGroupCode 角色组的编码
   */
  public roleGroupName;
  public roleGroupCode;

  //分页用到得data
  private data: Page = new Page();

  //把当前的页码信息发射出去，刷新的时候用到
  @Output()
  getRoleGroupPageInfo=new EventEmitter();

  //获取子组件RolemanComponent的实例，才可以调用它的方法,局部刷新用的
  @ViewChild(RolemanComponent)
  rolemanComponent: RolemanComponent;

  public addrType;//获取地址的类型，为了加载不同的页面使用的,传递到神龙页面


  constructor(private ajax: AjaxService, private routeInfo: ActivatedRoute) {
  }
  /**
   * 初始化的时候获取 系统列表的接口 和 机构的接口
   */
  ngOnInit() {
    /**
     * 系统列表的接口
     * sysCode 初始化系统的编码，默认第一个，然后根据sysCode调用初始化的角色组列表和角色列表
     * sysName 默认的第一个的名字
     * sysList 系统列表的数据
     */
    this.ajax.get({
      url: '/sys/list',
      data: {
        'sysName': ''
      },
      success: (data) => {
        this.sysCode = data[0].sysCode;
        this.sysName = data[0].sysName;
        this.sysList = data;
        this.queryRoleGroupDatas();
      },
      error: () => {
        console.log("sys/list  error");
      }
    });
    //添加角色组的按钮
    this.addGroupButton = {
      type:"add",
      text:"新增角色组",
      title:'新增角色组'
    };
    //绑定角色按钮
    this.bingRoleButton = [
      {
        title: "绑定角色",
        type: "add",
        size:'xs',
        callback: function (result) {
          result.then(() => {
            // alert("绑定角色成功");
          })
        }
      }
    ];
    //修改按钮配置
    this.updateButton= [
      {
        title: "修改",
        type: "update",
        size:'xs',
        callback: function (result) {
          result.then(() => {
            // alert("绑定角色成功");
          })
        }
      }
    ];

    //获取到路由传递过来的类型，从而在神龙的提交的时候加载刷新不同的页面
    this.addrType = this.routeInfo.snapshot.data[0]["type"];

  }

  /**
   * 系统发生变化的时候，获取到当前的系统编码，然后在刷新列表
   * @param sysCode
   * @param sysName
   */
  onSelectSys(sysCode,sysName): void {
    this.sysCode = sysCode;
    this.sysName = sysName;
    this.queryRoleGroupDatas();
  }

  /**
 * 角色组列表分页,点击分页的时候执行的事件
 * @param event
 *  把当前的页码信息发射出去，刷新用的
 */
public queryRoleGroupDatas(event?: PageEvent) {
  this.getRoleGroupPageInfo.emit(event);//把当前的页码信息发射出去，刷新用的
  let me = this, activePage = 1;
  if (typeof event !== "undefined") activePage = event.activePage;
  this.ajax.get({
    url: "/roleGroup/listpage",
    data: {
      curPage: activePage,
      sysCode: this.sysCode,
      pageSize: 8
    },
    success: (data) => {
      if (!isNull(data)) {
        me.data = new Page(data);
      }
    },
    error: () => {
      console.log('角色组列表分页错误');
    }
  });
}

  /**
   * 角色组列表的点击事件
   * @param roleGroupCode 角色组的编码
   * @param roleGroupName 角色组的名字
   */
  selectRole(roleGroupCode,roleGroupName){
    this.roleGroupName=roleGroupName;
    this.roleGroupCode=roleGroupCode;
  }

  /**
   * 修改角色组的状态
   * @param data 当前获取到得数据
   */
  updateRoleGroupState(data){
    if(data.isUse=="Y"){
      data.isUse="N"
    }else if(data.isUse=="N"){
      data.isUse="Y"
    }
    this.ajax.post({
      url: '/roleGroup/updateState',
      data: {
        'roleGroupCode': data.roleGroupCode,
        'isUse': data.isUse
      },
      success: () => {
        let text='';
        if(data.isUse=="N"){
          text="停用成功"
        }else if(data.isUse=="Y"){
          text="启用成功"
        }
        swal(text,'','success');
      },
      error: () => {
        swal('停启用连接数据库失败','','error');
      }
    });
  }

  //执行这个方法的时候，刷新相应的页面
  refresh() {
    this.rolemanComponent.queryRoleListDatasByroleGroupCode();
    this.queryRoleGroupDatas()
  }
}

