
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
  private orgCode:string = '';//初始化，为了让select框默认选中value=''的option

  @Input() private required:boolean;
  @Input() private organCode:string;

  @Output() selectedData = new EventEmitter();

  constructor(private ajax: AjaxService, private router:Router) { }

  ngOnInit() {
    if (this.organCode != '' || !isNullOrUndefined(this.organCode))this.orgCode = this.organCode;

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

  selected(){
    this.selectedData.emit(this.orgCode);
  }

}


