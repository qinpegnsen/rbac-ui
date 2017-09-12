import {Component, OnInit} from "@angular/core";
import {SettingsService} from "../../../core/settings/settings.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AjaxService} from "../../../core/services/ajax.service";
import {RoleComponent} from "../role/role.component";
import {RoleListComponent} from "../role-list/role-list.component";

const swal = require('sweetalert');
@Component({
  selector: 'app-rightpage',
  templateUrl: './rightpage.component.html',
  styleUrls: ['./rightpage.component.scss']
})

export class RightpageComponent implements OnInit {

  private queryId: number;//根据查询参数queryId的不同，呈现不同的页面

  private sysCode: string;//新增角色组，绑定角色用到，根据系统的的编码呈现当前的系统的名字

  //绑定角色,修改角色组的时候用到
  private roleGroupCode: string;
  private roleGroupName: string;

  //修改角色，分配权限的时候用到
  private roleCode: string;
  private roleName: string;


  public sysData;//系统列表的数据
  public limitCodes;//角色的权限集

  // 构造 初始化
  public roleCodes;//绑定的角色编码集

  public addrType;//获取地址的类型，为了加载不同的页面使用的,传递到神龙页面

  constructor(public settings: SettingsService, private router: Router, private ajax: AjaxService, private routeInfo: ActivatedRoute, private roleListComponent: RoleListComponent,private roleComponent: RoleComponent) {
    this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  /**
   * 根据不同的id，获取不同的查询参数
   * @param value 表单提交时时候的携带的数据
   * id=1 新增角色组
   * id=2 绑定角色
   * id=3 修改角色组
   * id=4 修改角色
   * id=5 新增角色
   * id=6 为角色分配权限
   */
  ngOnInit() {
    this.queryId = this.routeInfo.snapshot.queryParams['id'];
    this.addrType = this.routeInfo.snapshot.queryParams['addrType'];
    this.sysCode = this.routeInfo.snapshot.queryParams['sysCode'];//这个id=1和2,5 的时候都会用到，所以提到外面
    if (this.queryId == 1) { //新增角色组用到，根据系统的的编码呈现当前的系统的名字
    } else if (this.queryId == 2 || this.queryId == 3) {
      this.roleGroupCode = this.routeInfo.snapshot.queryParams['roleGroupCode'];
      this.selectRoleGroupNamebycode(this.roleGroupCode);//根据角色组的编码获取到角色组的名字
    } else if (this.queryId == 4 || this.queryId == 6) {
      this.roleCode = this.routeInfo.snapshot.queryParams['roleCode'];
      this.selectRoleNamebycode(this.roleCode);//根据角色的编码获取到角色的名字
    }
    //获取系统列表的信息
    this.sysData=JSON.parse(localStorage.getItem('sysListData'));

  }

  // 取消
  cancel() {
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }

  /**
   * 点击提交时执行的方法
   * 1.返回之前的页面
   * 2.局部刷新
   * queryId=4 addrType=='roleList'或者的时候加载角色列表页面 这里不能用 =5 =6 判断，因为公用组件，两个页面都有
   */
  closePage() {
    if (this.queryId == 5||this.addrType=='roleList' ){
      this.settings.closeRightPage();
      this.router.navigate(['/main/role/roleList']);
      this.roleListComponent.refresh();
    } else if(this.queryId == 1){
      this.router.navigate(['/main/role/roleGroup']);
      this.roleComponent.queryRoleGroupDatas();
    } else{
      this.settings.closeRightPage();
      this.router.navigate(['/main/role/roleGroup']);
      this.roleComponent.refresh()
    }
  }

  //根据角色组编码获取角色组的名字
  selectRoleGroupNamebycode(roleGroupCode) {
    this.ajax.get({
      url: '/roleGroup/load',
      async: false,
      data: {
        'roleGroupCode': roleGroupCode
      },
      success: (data) => {
        if (data.success) {
          this.roleGroupName = data.data.roleGroupName;
        } else {
          swal("系统错误", '', 'success');
        }
      },
      error: (data) => {
        swal("获取数据失败", '', 'error');
      }
    });
  }

  //根据角色编码获取角色的名字
  selectRoleNamebycode(roleCode) {
    this.ajax.get({
      url: '/role/load',
      async: false,
      data: {
        'roleCode': roleCode
      },
      success: (data) => {
        if (data.success) {
          this.roleName = data.data.roleName;
        } else {
          swal("系统错误", '', 'success');
        }
      },
      error: (data) => {
        swal("获取数据失败", '', 'error');
      }
    });
  }

  //获取到bing-role传递过来的角色编码集
  getRoleCodes(roleCodes) {
    this.roleCodes = roleCodes;
  }

  //获取到传递过来的权限编码集
  getRoleLimit(limitCodes) {
    this.limitCodes = limitCodes;
  }

  /**
   * 获取到当前点击的页码的数据
   */
  getRoleGroupPageInfo(pageData){
    console.log(pageData)
  }
  /**
   * 表单提交事件 根据不同的id，调取不同的接口
   * @param value 表单提交时时候的携带的数据
   * id=1 新增角色组
   * id=2 绑定角色
   * id=3 修改角色组
   * id=4 修改角色
   * id=5 新增角色
   * id=6 为角色分配权限
   */
  updateMssage(value) {
    if (this.queryId == 1) {
      this.ajax.post({
        url: '/roleGroup/add',
        async: false,
        data: {
          'sysCode': value.sysCode,
          'roleGroupName': value.roleGroupName,
          'remarks': value.remarks
        },
        success: (data) => {
          if (data.success) {
            swal('新增角色组成功', '', 'success');
          } else {
            let errorMsg = data.data.substring(data.data.indexOf('$$') + 2, data.data.indexOf('@@'))
            swal(errorMsg, '', 'error');
          }
        },
        error: (data) => {
          swal('新增角色组失败', '', 'error');
        }
      });
    } else if (this.queryId == 2) {
      this.ajax.post({
        url: '/roleGroup/addRelation',
        data: {
          'roleGroupCode': this.roleGroupCode,
          'roleCodes': this.roleCodes
        },
        async: false,
        success: (data) => {
          if (data.success) {
            swal('绑定角色成功', '', 'success');
          } else {
            swal('连接数据库成功', '绑定角色失败', 'error');
          }
        },
        error: (data) => {
          swal('绑定角色失败', '', 'error');
        }
      });
    } else if (this.queryId == 3) {
      console.log(value)
      this.ajax.put({
        url: '/roleGroup/update',
        data: {
          'roleGroupCode': this.roleGroupCode,//这里是通过路由传递过来的
          'roleGroupName': this.roleGroupName,
          'remarks': value.remarks
        },
        async: false,
        success: (data) => {
          if (data.success) {
            swal('修改角色组成功', '', 'success');
          } else {
            swal('连接数据库成功', '修改角色组失败', 'error');
          }
        },
        error: (data) => {
          swal('修改角色组失败', '', 'error');
        }
      });
    } else if (this.queryId == 4) {
      this.ajax.put({
        url: '/role/update',
        data: {
          'roleCode': this.roleCode,
          'roleName': this.roleName,
          'remarks': value.remarks
        },
        async: false,
        success: (data) => {
          if (data.success) {
            swal('修改角色成功', '', 'success');
          } else {
            swal('连接数据库成功', '修改角色失败', 'error');

          }
        },
        error: (data) => {
          swal('修改角色失败', '', 'error');
        }
      });
    } else if (this.queryId == 5) {
      this.ajax.post({
        url: '/role/add',
        data: {
          'sysCode': this.sysCode,
          'roleName': value.roleName,
          'remarks': value.remarks
        },
        async: false,
        success: (data) => {
          if (data.success) {
            swal('新增角色成功', '', 'success');
          } else {
            let errorMsg = data.data.substring(data.data.indexOf('$$') + 2, data.data.indexOf('@@'))
            swal(errorMsg, '', 'error');
          }
        },
        error: (data) => {
          swal('新增角失败', '', 'error');
        }
      });
    } else if (this.queryId == 6) {
      this.ajax.post({
        url: '/role/addRelation',
        data: {
          'roleCode': this.roleCode,
          'limitCodes': this.limitCodes
        },
        async: false,
        success: (data) => {
          if (data.success) {
            swal('分配权限成功', '', 'success');
          } else {
            swal('连接数据库成功', '但分配权限失败', 'error');
          }
        },
        error: (data) => {
          swal('分配权限失败', '', 'error');
        }
      });
    }
    this.closePage();//调用关闭页面的方法
  }
}
