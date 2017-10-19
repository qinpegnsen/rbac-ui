import {Component, OnInit} from '@angular/core';
import {RoleService} from "../role/role.service";
import {ActivatedRoute} from "@angular/router";
import {isNullOrUndefined} from "util";
import {number} from "ng2-validation/dist/number";
declare var $: any;

@Component({
  selector: 'app-roles-bind',
  templateUrl: './roles-bind.component.html',
  styleUrls: ['./roles-bind.component.scss']
})
export class RolesBindComponent implements OnInit {
  private sysCode: string;
  private roleCode: string;
  private limitCodes: string;
  private roleName: string;
  private limitList: any;

  constructor(private role: RoleService,
              private routeInfo: ActivatedRoute,) {
  }

  ngOnInit() {
    this.sysCode = this.routeInfo.snapshot.queryParams['sysCode'];
    this.roleCode = this.routeInfo.snapshot.queryParams['roleCode'];
    this.roleName= this.routeInfo.snapshot.queryParams['role'];
    if (!isNullOrUndefined(this.roleCode) && !isNullOrUndefined(this.sysCode)) {
      this.getLimitList();
    }
  }

  /**
   * 获取权限菜单等数据
   */
  private getLimitList() {
    let url = '/role/limitList';
    let data = {
      roleCode: this.roleCode,
      sysCode: this.sysCode
    }
    this.limitList = this.role.postRequest(url, data)
  }

  /**
   * 选择
   * @param target
   * @param parent
   */
  checkedItems(target,parent,level?) {
    let $target = $(target),$parent = $(parent);
    if ($target.prop('checked')) {
      $parent.next('ul').find('._val').prop('checked', true)
    } else {
      $target.parents('.everyone').next('ul').find('._val').prop('checked', false)
    };
    let parents = $parent.parent('li').parent('ul');//找到当前元素所在级别的ul
    let siblings = parents.children('li');//选择当前元素父元素(.everyone)所在级别的ul的所有子元素li
    this.parentChecked(parents,siblings);
    if(level == 3){
      let level2 = parents.parent('li').parent('ul');//找到当前父级元素所在级别的ul
      this.parentChecked(level2,siblings);
    }
  }

  parentChecked(parents,siblings){
    if (siblings.find('._val').length == siblings.find('._val:checked').length){
      parents.prev('.everyone').find('._val').prop('checked', true);
    }else{
      parents.prev('.everyone').find('._val').prop('checked', false);
    }
  }

  /**
   * 获取所有被选中的全线项目的权限编码
   */
  private getAllCheckedLimitCodes(){
    let allChecked = $('.limit-menu ._val:checked'),limitCodes = '';
    for(let i = 0; i < allChecked.length; i ++){
      limitCodes += allChecked.eq(i).val()+','
    }
    this.limitCodes = limitCodes.substring(0,limitCodes.length-1);
    console.log("█ this.limitCodes ►►►",  this.limitCodes);
  }

  /**
   * 分配权限
   */
  allotLimt(){
    this.getAllCheckedLimitCodes()
    let url = '/role/addRelation';
    let data = {
      roleCode: this.roleCode,
      limitCodes: this.limitCodes
    }
    this.role.postRequest(url,data,true)
  }

}
