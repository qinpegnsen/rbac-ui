import {Component, OnInit} from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {isNull} from "util";
import {Page} from "../../../core/page/page";
import * as _ from "lodash";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
@Component({
  selector: 'app-ng2-datatable',
  templateUrl: './ng2-datatable.component.html',
  styleUrls: ['./ng2-datatable.component.scss']
})
export class Ng2DatatableComponent implements OnInit {
  private data: Page = new Page();
  private singleData: any;

  constructor(private ajax: AjaxService) {
  }

  ngOnInit() {
    let me = this;
    this.queryDatas();
  }

  public queryDatas(event?:PageEvent) {
    console.log("页面端event", event);
    let me = this,activePage = 1;
    if(typeof event !== "undefined") activePage =event.activePage;

    this.ajax.get({
      url: "/elder/listcondition",
      data: {
        curPage:activePage
      },
      success: (data) => {
        if (!isNull(data)) {
          Object.assign(me.data, data);
          me.singleData = data.voList;
        }
      },
      error: (data) => {
        console.log('data', data);
      }
    });
  }

}
