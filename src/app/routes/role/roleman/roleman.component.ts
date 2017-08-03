import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {isNull} from "util";
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {AjaxService} from '../../../core/services/ajax.service';
const swal = require('sweetalert');
@Component({
  selector: 'app-roleman',
  templateUrl: './roleman.component.html',
  styleUrls: ['./roleman.component.scss']
})
export class RolemanComponent implements OnInit,OnChanges {
  private data: Page = new Page();
  private buttonConfig; private buttonConfig1;
  @Input()
  public sysCode;
  @Input() roleGroupCode;
  public roleCode;
  constructor(private ajax: AjaxService) {

  }
  ngOnInit() {
    //分配权限按钮
    this.buttonConfig = [
      {
        text:"",
        title:"分配权限",
        type: "add",
        size:"xs",
        callback:function(result){
          result.then((id)=>{
            // alert(id);
          })
        }
      },
    ];
    //修改按钮
    this.buttonConfig1 = [
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
    //初始化的角色列表
    this.queryDatasBySyscode()
  }

  //输入属性的变化只能在这个钩子里面写
  ngOnChanges(changes: SimpleChanges): void {
  //当sysCode变化的时候再次调动
  if(changes["sysCode"] && this.sysCode){
    this.queryDatasBySyscode()
  }
  //当roleGroupCode变化的时候再次调动
  if(changes["roleGroupCode"] && this.roleGroupCode){
    this.queryDatasByroleGroupCode()
  }
}


  queryRoleList(event){
    if(this.sysCode){
      this.queryDatasBySyscode(event)
    }else if(this.roleGroupCode){
      this.queryDatasByroleGroupCode(event)
    }
  }

  //根据系统编码变化的角色列表
  public queryDatasBySyscode(event?: PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    this.ajax.get({
      url: "/role/listpage",
      data: {
        curPage: activePage,
        sysCode: this.sysCode,
        pageSize:2
      },
      success: (data) => {
        if (!isNull(data)) {
          me.data = new Page(data);
          console.log(this.sysCode);
          console.log("█ data ►►►",  data);
          console.log("我是根据系统编码查询出来的角色列表")
        }
      },
      error: (data) => {
        console.log('根据系统编码变化的角色列表错误');
      }
    });
  }

  //根据角色组编码变化的角色列表
  public queryDatasByroleGroupCode(event?: PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    this.ajax.get({
      url: "/role/getRoleListPageByRoleGroupCode",
      data: {
        curPage: activePage,
        roleGroupCode: this.roleGroupCode,
        pageSize:2
      },
      success: (data) => {
        if (!isNull(data)) {
          me.data = new Page(data);
          console.log(data)
          console.log("█ this.roleGroupCode ►►►",  this.roleGroupCode);
          console.log("我是根据角色组的编码慢查询出来的角色列表")
          // console.log(data)
        }
      },
      error: (data) => {
        console.log("根据角色组编码查询错误");
      }
    });
  }

  //修改角色的状态
  updateRoleState(data){
    if(data.isUse=="Y"){
      data.isUse="N"
    }else if(data.isUse=="N"){
      data.isUse="Y"
    }
    console.log(data.isUse)
    this.ajax.post({
      url: '/role/updateState',
      data: {
        'roleCode': data.roleCode,
        'isUse': data.isUse
      },
      success: (data) => {
        swal('成功提醒', '成功，状态：success', 'success');
        console.log("角色的停启用状态修改成功")
      },
      error: (data) => {
        console.log("error");
      }
    });
  }
}
