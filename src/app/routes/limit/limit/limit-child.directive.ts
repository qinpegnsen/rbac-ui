import { Directive ,HostListener,Input} from '@angular/core';
import {LimitService} from "./limit.service";
declare var $:any;

@Directive({
  selector: '[limitChild]'
})
export class LimitChildDirective {
  @Input() limitChild:string;

  constructor(private limits:LimitService) {
  }

  @HostListener("click", ['$event'])
  onClick(event) {
    //设置图标样式
    let parent = event.target.parentNode.parentNode;
    if (parent.nodeName != "TR") parent = parent.parentNode;
    let parentId = parent.id + "_child", parentIdAll = "#" + parentId;
    if ($(parentIdAll).length < 1) { //展开
      this.iconStyle(event, "fa-caret-up");
      let info = this.limits.queryMenuList(1, 6, null); //查询数据
      let list:Array<any> = info['voList']; //获取数据源
      let trList = ""; //拼装tr
      for (var i = 0; i < list.length; i++) { //拼装
        trList += '<tr class="text-center">' +
          '<td style="padding-left: 20px">' + (i + 1) + '</td>' +
          '<td>' + list[i].menuName + '</td>' +
          '<td>' + list[i].menuUrl + '</td>' +
          '<td>' + list[i].preMenuCode + '</td>' +
          '<td>' + list[i].menuIcon + '</td>' +
          '<td>' + list[i].level + '</td>' +
          '<td>' + list[i].remarks + '</td>' +
          '<td>' + list[i].ord + '</td>' +
          '</tr>';
      }
      //设置样式
      $(parent).css({"border-left": "1px solid green", "border-right": "1px solid green"});
      //拼装所需内容
      let html = `
      <style type="text/css">
        .table-child{
          background: #d9e0e7;
        }
        .table-child .table thead tr th{
          padding:5px 8px;
        }
        .table-child td{
        border-bottom: 1px solid green;border-left: 1px solid green;border-right: 1px solid green;
        }
        .table-child .table tr td{
        border: none
        }
      </style>
      <table class="table table-striped">
        <thead>
        <tr>
          <th class="unselectable text-center sort-num">
            序号
          </th>
          <th class="col-lg-1  unselectable text-center">
            <rzhDefaultSorter by="name">菜单名称</rzhDefaultSorter>
          </th>
          <th class="col-lg-1  unselectable text-center">
            <rzhDefaultSorter by="url">菜单RUL</rzhDefaultSorter>
          </th>
          <th class="col-lg-2  unselectable text-center">
            <rzhDefaultSorter by="menu">上级菜单</rzhDefaultSorter>
          </th>
          <th class="col-lg-1  unselectable text-center">
            <rzhDefaultSorter by="icon">菜单图标</rzhDefaultSorter>
          </th>
          <th class="col-lg-1  unselectable text-center">
            <rzhDefaultSorter by="level">级别</rzhDefaultSorter>
          </th>
          <th class="col-lg-2  unselectable text-center">
            <rzhDefaultSorter by="note">备注</rzhDefaultSorter>
          </th>
          <th class="col-lg-1  unselectable text-center">
            <rzhDefaultSorter by="order">菜单顺序</rzhDefaultSorter>
          </th>
        </thead>
        <tbody>
        ` + trList + `
        </tbody>
      </table>
      `;
      //添加内容到指定位置
      $(parent).after("<tr style='margin-top: -5px;' class='table-child' id='" + parentId + "'>" +
        "<td style='border-top: none;' colspan='10'>" +
        "<div class='pl0 pr0 w3 pull-left'><img src='assets/img/menu/child.png' width='90%'></div>" +
        "<div class='pl0 pr0 w97 pull-left'>" + html + "</div>" +
        "</td>" +
        "</tr>"
      );
    } else { //关闭
      //设置图标样式
      this.iconStyle(event, "fa-caret-down");
      //取消样式
      $(parent).css({"border-left": "none", "border-right": "none"});
      //删除节点
      $(parentIdAll).remove();
    }

  }

  /**
   * 设置图标样式（辅助）
   * @param event
   * @param style
   */
  private iconStyle(event, style) {
    //设置图标样式
    if (event.target.nodeName != "I") {
      $(event.target).children("i").removeClass();
      $(event.target).children("i").addClass("fa " + style);
    } else {
      $(event.target).removeClass();
      $(event.target).addClass("fa " + style);
    }
  }

}
