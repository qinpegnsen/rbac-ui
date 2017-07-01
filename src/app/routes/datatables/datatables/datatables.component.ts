import {Http} from '@angular/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {TableService} from '../../../core/list/table.service';
declare var $: any;

@Component({
  selector: 'app-datatables',
  template: `<button (click)="ceshi()">123456</button><table id="elderGrid" class="table table-striped table-bordered"></table>`,
  styleUrls: ['./datatables.component.scss']
})

export class DatatablesComponent implements OnInit {
  public test;
  private table;
  private tableId; //列表id

  constructor(private http: Http,private tableInfo:TableService) { //初始化
    this.tableId = 'elderGrid';
    // tableInfo.elderListData(http,"/upload/basic/uid");
  }

  ngOnInit() {
    let columns = [
      {sTitle: '序号', width: '5%'},
      {mDataProp: "username", sTitle: "客户名"},
      {mDataProp: "sexText", sTitle: "性别"},
      {mDataProp: "age", sTitle: "年龄"},
      {mDataProp: "phone", sTitle: "手机号"}
    ], searchPlaceholder = '姓名或手机号';
    this.table = this.tableInfo.getDataTables(this.tableId,"/elder/listcondition", searchPlaceholder, columns);
  }

  // private elderListData() {
  //   this.http.get("/login/login", {
  //     method: "post",
  //     params: {
  //       'staffno': 'admin',
  //       'pwd': '888888'
  //     }
  //   }).subscribe((data) => {
  //     console.log("data", data);
  //   });
  //
  //   this.http.get("/upload/basic/uid", {
  //     method: "get"
  //   }).subscribe((data) => {
  //     console.log("data", data);
  //   });
  // }
  ceshi(){
    console.log(this.tableInfo.getSelRow(this.table));
  }

}
