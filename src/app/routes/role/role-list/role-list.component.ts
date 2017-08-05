import { Component, OnInit } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  public sysList;
  public sysName;
  public sysCode;
  private addButton;

  constructor(private ajax: AjaxService) { }

  ngOnInit() {
    this.addButton = {
      type:"add",
      text:"新增角色",
      title:'新增角色'
    };
    //系统列表的接口，以及设置初始化的sysCode，然后根据sysCode调用初始化的角色列表
    this.ajax.get({
      url: '/sys/list',
      data: {
        'sysName': ''
      },
      success: (data) => {
        this.sysCode = data[0].sysCode;
        this.sysList = data;
        this.sysName=data[0].sysName;
      },
      error: (data) => {
        console.log("sys/list  error");
      }
    });
  }

  onSelectSys(sys): void {
    this.sysCode = sys.value;

  }

}
