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
  @Input()
  public roleGroupCode;
  @Input()
  public roleGroupName="当前系统下的所有角色";
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
        pageSize:8
      },
      success: (data) => {
        if (!isNull(data)) {
          me.data = new Page(data);

        }
      },
      error: (data) => {

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
        pageSize:8
      },
      success: (data) => {
        if (!isNull(data)) {
          me.data = new Page(data);
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

    this.ajax.post({
      url: '/role/updateState',
      data: {
        'roleCode': data.roleCode,
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
      error: (data) => {
        console.log("error");
      }
    });
  }
}
