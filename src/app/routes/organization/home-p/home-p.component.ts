import {Component, OnInit} from '@angular/core';
import {AppStore} from "../store/app-store";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {OrgService} from '../server/org.service';
declare var $: any;

const path_arr = [];
@Component({
  selector: 'app-home-p',
  templateUrl: './home-p.component.html',
  styleUrls: ['./home-p.component.scss']
})
export class HomePComponent implements OnInit {
  public isActive = true;
  public tree_root:any;
  public tree_tow:any;
  public tree_s:any;
  public path_arr:Array<any>;
  public tree_status:Array<any>;
  public obj:any;
  public path = [];
  public active_tree_cell:string;
  public orgEmpExtVOList:Array<any>;
  public list_data:Array<any>;
  public result;
  public pre_arr;
  constructor(private store:Store<AppStore>,
              private org:OrgService){
    console.log($);
  }

  /*toggle(name) {
    this.active_tree_cell = name;
    this.forPath(name, this.obj.root);
    /!*this.store.select('path').subscribe((res) => {
     console.log(res);});*!/
  }*/
  menu = [
    {
      title: '郑州三楂红科技有限公司',
      index: 0,
      items: [
        {
          index: 1,
          title: '1.1',
          items: [
            {
              name: '1.1.1',
              title: 'xxx1',
              items: [
                {
                  name: '1.1.2',
                  title: 'xxx2',
                  items: [
                    {
                      name: '1.1.3',
                      title: 'xxx3',
                      items: [

                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          index: 1,
          title: '1.2',
          items: []
        }
      ]
    }
  ];
  ngOnInit() {
    this.getOrgList('/dept/list');
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
    this.orgEmpExtVOList = [];
    this.active_tree_cell = this.tree_root.name;

    this.store.select('staff').subscribe((item) => {
      this.orgEmpExtVOList = item as Array<any>;
    })

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

  getOrgList(url:string) {
    this.org.getOrgList(url).subscribe((res) => {
      const {result, pre_arr} = this.forDate(res);
      this.result = result;
      this.pre_arr = pre_arr;
      //console.log(result);
      //console.log(pre_arr);
    })
  }
  forDate(data: any): {result: any, pre_arr: any} {
    const result = [];
    const org_arr = {};
    data.forEach((item) => {
      for (let a in item) {
        if (a === 'deptCode') {
          org_arr[item[a]] = item;
        }
      }
    });
    let i = 0;
    const pre_arr = {};
    data.forEach((item) => {
      for (let a in item) {
        if (a === 'preCode') {
          //console.log(item[a]);
          // 获取顶级
          if (item[a] === null) {
            result[i] = item;
            i ++;
          } else {
            for (let key in org_arr) {
              if (item[a] === key) {
                if (pre_arr[key]) { // 如果重复
                  pre_arr[key].push(item);
                } else {
                  pre_arr[key] = [];
                  pre_arr[key].push(item);
                }
              }
            }
          }
        }
      }
    });
    return {result: result, pre_arr: pre_arr}
  }
  // 递归解析树的路径
 /* forPath(target:string, obj) {
    for (let a in obj) {
      if (a == "name") {
        this.path[obj.index] = obj[a];
        if (obj[a] === target) {
          this.path.length = obj.index + 1;
          const arr = [];
          for (let i = 0; i < this.path.length; i++) {
            arr.push(this.path[i]);
          }
          this.store.dispatch({type: 'PATH_ADD', payload: arr});
        }
      } else if (typeof (obj[a]) == "object") {
        this.forPath(target, obj[a]);
      }
    }
  }*/

}
