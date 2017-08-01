
import {AjaxService} from "../../../core/services/ajax.service";
import { Component,EventEmitter, Input, Output, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {isNull} from "util";

@Component({
  selector: 'app-select-organ',
  templateUrl: './select-organ.component.html',
  styleUrls: ['./select-organ.component.scss']
})
export class SelectOrganComponent implements OnInit {
  private organs:any;
  private orgCode:string;

  @Input() private required:boolean;
  @Input() private organCode:string;

  @Output() selectedData = new EventEmitter();

  constructor(private ajax: AjaxService, private router:Router) { }

  ngOnInit() {

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


