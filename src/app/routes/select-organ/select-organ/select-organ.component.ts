
import {AjaxService} from "../../../core/services/ajax.service";
import { Component,EventEmitter, Input, Output, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {isNull,isNullOrUndefined} from "util";

@Component({
  selector: 'app-select-organ',
  templateUrl: './select-organ.component.html',
  styleUrls: ['./select-organ.component.scss']
})
export class SelectOrganComponent implements OnInit {
  private organs:any;
  private orgName="请选择机构";
  private orgCode:string = '';//初始化，为了让select框默认选中value=''的option

  @Input() private required:boolean;
  @Input() private organCode:string;
  @Input() private organName:string;

  @Output() selectedData = new EventEmitter();

  constructor(private ajax: AjaxService, private router:Router) { }

  ngOnInit() {
    if (this.organCode !== '' && !isNullOrUndefined(this.organCode))this.orgCode = this.organCode;
    if (this.organName !== '' && !isNullOrUndefined(this.organName))this.orgName = this.organName;

    this.ajax.get({
      url: "/organ/list",
      success: (res) => {
        if (!isNull(res)) {
          this.organs = res;
        }
      },
      error: (res) => {
        console.log('getorgans', res);
      }
    });
  }

  selected(code,orgName){
    this.orgName=orgName;
    this.selectedData.emit(code);
  }

}


