import {Component, OnInit} from '@angular/core';
import {AppStore} from "../store/app-store";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";

const path_arr = [];
@Component({
  selector: 'app-home-p',
  templateUrl: './home-p.component.html',
  styleUrls: ['./home-p.component.scss']
})
export class HomePComponent implements OnInit {
  public isActive = true;
  public tree_root: any;
  public tree_tow: any;
  public tree_s: any;
  public path_arr: Array<any>;
  public tree_status: Array<any>;
  public obj: any;
  public path = [];
  public active_tree_cell: string;
  public orgEmpExtVOList: Array<any>;
  public list_data: Array<any>;
  constructor( private store: Store<AppStore>) {
  }

  toggle(name) {
    this.active_tree_cell = name;
    this.forPath(name, this.obj.root);
    /*this.store.select('path').subscribe((res) => {
      console.log(res);});*/
  }

  ngOnInit() {
    this.tree_status = [];
    this.tree_root = {
      canManage: true,
      deptEditors: [],
      deptGroupVO: {count: 23, cid: "362109818", groupName: "郑州三楂红科技有限公司", memberLimit: 1000},
      deptHiding: false,
      deptId: -1,
      deptManagers: [],
      deptPermits: [],
      deptSettings: {groupContainOuterDept: false, groupContainHiddenDept: false, shareBalanceCurrentDept: false},
      groupOwner: {name: "张丁方", staffId: "manager5359", uid: 43689234},
      hasSubDept: true,
      memberCount: 23,
      name: "郑州三楂红科技有限公司",
      orgId: 26949058,
      outerDept: false,
      outerDeptPermits: [],
      outerUserPermits: [],
      sortFactor: 0,
      userPermits: [],
      success: true
    };
    this.tree_tow = [
      {
        canManage: true,
        deptId: 44227455,
        deptSettings: {
          autoAddUser: true,
          createDeptGroup: true,
          groupContainHiddenDept: false,
          groupContainOuterDept: false,
          groupContainSubDept: true,
          hideDept: false,
          outerDept: false,
          shareBalanceCurrentDept: false,
          soloBalance: false
        },
        hasSubDept: true,
        memberCount: 20,
        name: "技术部",
        orgId: 26949058,
        sortFactor: 44227455,
        superId: -1
      },
      {
        canManage: true,
        deptId: 44227455,
        deptSettings: {
          autoAddUser: true,
          createDeptGroup: true,
          groupContainHiddenDept: false,
          groupContainOuterDept: false,
          groupContainSubDept: true,
          hideDept: false,
          outerDept: false,
          shareBalanceCurrentDept: false,
          soloBalance: false
        },
        hasSubDept: true,
        memberCount: 0,
        name: "财务部",
        orgId: 26949058,
        sortFactor: 44227455,
        superId: -1
      },
      {
        canManage: true,
        deptId: 44227455,
        deptSettings: {
          autoAddUser: true,
          createDeptGroup: true,
          groupContainHiddenDept: false,
          groupContainOuterDept: false,
          groupContainSubDept: true,
          hideDept: false,
          outerDept: false,
          shareBalanceCurrentDept: false,
          soloBalance: false
        },
        hasSubDept: true,
        memberCount: 0,
        name: "权限系统 部门测试",
        orgId: 26949058,
        sortFactor: 44227455,
        superId: -1
      }
    ];
    this.tree_s = [
      {
        canManage: true,
        deptId: 44787115,
        memberCount: 5,
        name: "UI设计组",
        orgId: 26949058,
        sortFactor: 0,
        superId: 44227455
      },
      {
        canManage: true,
        deptId: 44787115,
        memberCount: 4,
        name: "APP 开发组",
        orgId: 26949058,
        sortFactor: 0,
        superId: 44227455
      },
      {
        canManage: true,
        deptId: 44787115,
        memberCount: 8,
        name: "前端开发",
        orgId: 26949058,
        sortFactor: 0,
        superId: 44227455
      },
      {
        canManage: true,
        deptId: 44787115,
        memberCount: 11,
        name: "后台服务开发",
        orgId: 26949058,
        sortFactor: 0,
        superId: 44227455
      },
    ];

    this.list_data = [this.tree_root];
    this.orgEmpExtVOList = [
      {email: '', extNumber: '', name: '伯缘', mobile: '13783597063', jobNumber: ''},
      {email: '', extNumber: '', name: '鄂总', mobile: '17719878068', jobNumber: ''},
      {email: '', extNumber: '', name: '秦总', mobile: '18635020813', jobNumber: ''}
    ];
    this.active_tree_cell = this.tree_root.name;

    // 默认值
    this.store.dispatch({type: 'PATH_ADD', payload: [this.tree_root.name]});

    this.obj = {};
    for (let key in this.tree_root) {
      this.obj.root = {
        name: this.tree_root['name'],
        child: this.tree_root.memberCount ? [] : null,
        index: 0,
      }
    }

    this.tree_tow.forEach((item) => {
      this.obj.root.child.push({
        name: item.name,
        child: item.memberCount ? [] : null,
        index: 1,
      })
    });

    this.tree_s.forEach((item) => {
      for (let i = 0; i < this.obj.root.child.length; i++) {
        if (this.obj.root.child[i].child !== null) {
          this.obj.root.child[i].child.push({
            name: item.name,
            index: 2,
          });
        }
      }
    });
    if (this.tree_root.memberCount) {
      this.tree_status.push(true);
    }
  }
  // 递归解析树的路径
  forPath(target: string, obj) {
    for (let a in obj) {
      if (a == "name") {
        this.path[obj.index] = obj[a];
        if (obj[a] === target) {
          this.path.length = obj.index + 1;
          const arr = [];
          for (let i = 0; i < this.path.length; i ++) {
            arr.push(this.path[i]);
          }
          this.store.dispatch({type: 'PATH_ADD', payload: arr});
        }
      } else if (typeof (obj[a]) == "object"){
        this.forPath(target, obj[a]);
      }
    }
  }
}
