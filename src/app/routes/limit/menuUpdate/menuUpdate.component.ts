import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
const swal = require('sweetalert');
@Component({
  selector: 'app-rightamend',
  templateUrl: './menuUpdate.component.html',
  styleUrls: ['./menuUpdate.component.scss'],
  providers: [SettingsService]
})
export class MenuUpdateComponent implements OnInit {

  private queryId;
  private limitForm = {};
  private pageForm = {};

  constructor(public ajax:AjaxService, public settings:SettingsService, private router:Router, private route:ActivatedRoute, private routeInfo:ActivatedRoute) {
    this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {
      let mc,//menuCode 菜单编码
      pc,//pageCode 页面编码
      oc,//optCode 功能操作编码
      fc //fileCode 文件编码

    //获取修改id
    this.queryId = this.routeInfo.snapshot.queryParams['id'];
    pc = this.routeInfo.snapshot.queryParams['pageCode'];
    oc = this.routeInfo.snapshot.queryParams['optCode'];
    fc = this.routeInfo.snapshot.queryParams['fileCode'];
    /**
     * 获取菜单编码
     */
    this.route.params.subscribe(params => {
      mc = params['menuCode'];
    });

    /**
     * 根据菜单编码获取菜单数据
     */
    let requestUrl,requestData;
    switch (this.queryId){
      case '1':
        requestUrl = '/limitPage/load';
        requestData = {pageCode:pc};
        break;
      case '3':
        requestUrl = '/limitOpt/load';
        requestData = {optCode:oc};
        break;
      case '5':
        requestUrl = '/limitFile/load';
        requestData = {fileCode:fc};
        break;
      default:
        requestUrl = '/limitMenu/load';
        requestData = {menuCode:mc};
        break;
    }
    /**
     * 请求详细数据，并显示
     */
    this.ajax.get({
      url: requestUrl,
      async: false, //同步请求
      data: requestData,
      success: (res) => {
        if (res.success) {
          console.log("█ res ►►►",  res);
          this.limitForm = res.data, this.limitForm['menuCode'] = mc;
        } else {
          let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post limit error");
      }
    })

  }

  // 取消
  cancel() {
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }

  //修改

  submitLimitData() {

    let me = this, submitData;
    let submitUrl = '/limitMenu/update';
    console.log("█ submitUrl ►►►", submitUrl);
    if (this.queryId == '1') {
      submitUrl = '/limitPage/update';
      submitData = me.pageForm;
    }else if(this.queryId=='3'){
      submitUrl = '/limitOpt/update';
    }else if(this.queryId=='5'){
      submitUrl = '/limitFile/update';
    } else {
      submitData = me.limitForm;
    }

    me.ajax.post({
      url: submitUrl,
      data: submitData,
      success: (res) => {
        console.log("█ res ►►►", res);
        if (res.success) {
          this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
          swal('提交成功！', '列表已自动更新...', 'success');
          //this.outputvalue.emit(true);//提交成功后向父组件传值
        } else {
          let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post limit error");
      }
    })
  }
}
