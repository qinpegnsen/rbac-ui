import {Inject, Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {AjaxService} from '../services/ajax.service';
declare var $: any;

/**
 * 初始化datatable属性
 */
@Injectable()
export class TableService {
  public _ajax: any;

  constructor(@Inject(AjaxService) ajax: AjaxService) { //构造初始化
    this._ajax = ajax; //初始化已封装的ajax
  }

  // 生成列表信息
  getDataTables(tableId, dataUrl, searchPlaceholder, columns, paramList ?) {
    if (isNullOrUndefined(paramList)) {
      let _this = this;
      paramList = {
        // bStateSave: true,                   //状态保存，使用了翻页或者改变了每页显示数据数量，会保存在cookie中，下回访问时会显示上一次关闭页面时的内容
        processing: true,                    //加载数据时显示正在加载信息
        searching: true,                   //显示/屏蔽搜索框
        lengthChange: false,                //显示、屏蔽每页显示条数
        autoWidth: false,
        showRowNumber: true,
        serverSide: true,                    //指定从服务器端获取数据
        sPaginationType: 'full_numbers',
        language: {
          sSearchPlaceholder: searchPlaceholder
        },
        fnDrawCallback: function () {
          this.api().column(0).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
          });
        },
        pageLength: 25,                    //每页显示25条数据
        sAjaxDataProp:"voList",
        ajaxSource: dataUrl,//获取数据的url
        fnServerData: function (sSource, aoData, fnCallback) { //获取数据的处理函数
          _this._ajax.post({
            url: '/login/login',
            data: {
              'staffno': 'admin',
              'pwd': '888888'
            },
            success: (data) => {
              console.log('data', data);
            },
            error: (data) => {
              console.log('data', data);
            }
          });


          _this._ajax.get({
            url: sSource,
            data: {
              curPage: 1,
              pageSize: 25
            },
            success: (data) => {
              fnCallback(data);
              console.log("data",data);
            },
            error: (data) => {
              console.log('data', data);
            }
          });
        },
        aoColumns: columns,
        aoColumnDefs: [//设置列的属性
          {
            bSortable: false,
            data: null,
            targets: 0
          }
        ]
      };
    }

    var table = $('#' + tableId).DataTable(paramList);
    //单击选择数据，并改变背景色
    $('#' + tableId + ' tbody').on('click', 'tr', function () {
      if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
      } else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
      }
    });
    return table;
  }

  //获取选中行数据
  getSelRow(table) {
    let sel = table.$('tr.selected');
    if (sel.length < 1) return null;
    else return table.row(sel).data();
  }

}
