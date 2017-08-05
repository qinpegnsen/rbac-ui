import { Component, OnInit } from '@angular/core';
import {isNull} from "util";
import {Router} from '@angular/router';
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {OrganService} from "./organ.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";

@Component({
  selector: 'app-organ',
  templateUrl: './organ.component.html',
  styleUrls: ['./organ.component.scss'],
  providers:[OrganService,RzhtoolsService]
})
export class OrganComponent implements OnInit {
  private table;
  public organs: Page = new Page();
  private buttonConfig;
  private addButton;
  public searchKey:string = '';

  constructor( private router:Router, public settings: SettingsService,
               private organService:OrganService,private tools: RzhtoolsService) {  }

  ngOnInit() {

    let me = this;
    this.queryDatas();
    //按钮配置
    this.addButton = {
      type:"add",
      text:"添加机构",
      title:'添加机构'
    };
    this.buttonConfig = [
      {
        title:"编辑",
        type: "update",
        callback:function(result,orgCode){
          result.then((id)=>{
            me.router.navigate(['/main/organ/updateOrgan',orgCode]);
          })
        }
      },
      {
        title:"详情",
        type: "details",
        callback:function(result,orgCode) {
          result.then((id)=> {
            me.router.navigate(['/main/organ/orgDetail',orgCode]);
          })
        }
      }
    ];

  }
  /**
   * 添加回调方法
   * @param result  promise对象，回传id
   */

  private updateBoss(orgCode){
    this.router.navigate(['/main/organ/updateBoss',orgCode]);
  }

  private updateType(orgCode){
    this.router.navigate(['/main/organ/updateType',orgCode]);
  }

  /**
   * 改变机构状态
   * @param state
   * @param orgCode
     */
  changeState(state,orgCode){
    this.organService.changeState(state,orgCode);
    this.queryDatas()
  }


  //查询机构列表
  queryDatas(event?:PageEvent) {
    let me = this,activePage = 1;
    if(typeof event !== "undefined") activePage =event.activePage;
    let result = me.organService.getOrganListpage(activePage,this.searchKey);//查询机构列表
    me.organs = new Page(result);
  }

}
