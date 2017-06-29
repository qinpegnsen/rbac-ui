import { HomeComponent } from './../../home/home/home.component';
import { Http } from '@angular/http';
import { Component, OnInit, Directive } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-datatables',
    templateUrl: './datatables.component.html',
    styleUrls: ['./datatables.component.scss']
})

export class DatatablesComponent implements OnInit {

    public singleData;
    public test;
    private table;
    constructor(private http: Http) {
        var homeComponent = new HomeComponent();
    }

    ngOnInit() {
        var data = [{
            "name": "Wing",
            "email": "tellus.eu.augue@arcu.com",
            "regDate": "2016-01-09T14:48:34-08:00",
            "city": "Paglieta",
            "age": 25
        }, {
            "name": "Whitney",
            "email": "sed.dictum@Donec.org",
            "regDate": "2017-01-23T20:09:52-08:00",
            "city": "Bear",
            "age": 32
        }, {
            "name": "Oliver",
            "email": "mauris@Craslorem.ca",
            "regDate": "2015-11-19T19:11:33-08:00",
            "city": "Bruderheim",
            "age": 31
        }];
        this.table = $('#elderGrid').DataTable({
            // bStateSave: true,                   //状态保存，使用了翻页或者改变了每页显示数据数量，会保存在cookie中，下回访问时会显示上一次关闭页面时的内容
            processing: true,                    //加载数据时显示正在加载信息
            searching: true,                   //显示/屏蔽搜索框
            lengthChange: false,                //显示、屏蔽每页显示条数
            autoWidth: false,
            showRowNumber: true,
            serverSide: false,                    //指定从服务器端获取数据
            sPaginationType: "full_numbers",
            language: {
                sSearchPlaceholder: "姓名/电话/身份证"
            },
            fnDrawCallback: function () {
                this.api().column(0).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            },
            // pageLength: 25,                    //每页显示25条数据
            // ajaxSource: "/elder/listcondition",//获取数据的url
            // fnServerData: elderService.elderListData,           //获取数据的处理函数
            // fnServerParams: function (aoData) {
            //     aoData.push({name: "selPost", value: $scope.selPost}, {name: "inText", value: $scope.sel.intext});
            // },
            data:data,
            aoColumns: [
                {sTitle: "序号", width: "5%"},
                { mDataProp: "name", sTitle: "客户名" },
                { mDataProp: "email", sTitle: "邮箱" },
                { mDataProp: "city", sTitle: "城市" },
                { mDataProp: "age", sTitle: "年龄" }
            ],
            aoColumnDefs: [//设置列的属性
                // {
                //     bSortable: false,
                //     targets: 0,
                //     defaultContent: $scope.checkInfos
                // },
                {
                    bSortable: false,
                    data: null,
                    targets: 0
                }
            ]
        });
    }

    private elderListData(sSource, aoData, fnCallback) {
        // this.http.get("assets/server/datatable.json")
        //     .subscribe((data) => {
        //         this.singleData = data.json();
        //         fnCallback();
        //     });
        // Ajax.get({
        //     url: sSource + "?v=" + new Date().getTime(),
        //     data: {}, //以json格式传递
        //     async: false,
        //     "success": function(response) {
        //         fnCallback(response);
        //     }//服务器端返回的对象的returnObject部分是要求的格式
        // });
    }
}
