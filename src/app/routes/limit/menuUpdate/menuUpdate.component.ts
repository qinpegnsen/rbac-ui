import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
import {LimitComponent} from "../limit/limit.component";
const swal = require('sweetalert');
@Component({
  selector: 'app-rightamend',
  templateUrl: './menuUpdate.component.html',
  styleUrls: ['./menuUpdate.component.scss'],
  providers: [SettingsService]
})
export class MenuUpdateComponent implements OnInit {

  private queryId;//获取修改按钮的ID
  private limitForm = {};//获取权限菜单列表里的参数
  private pageForm = {};//获取权限页面列表里的参数
  private optForm = {};//获取功能操作列表里的参数
  private fileForm = {};//获取功能操作列表里的参数


  /**
   * 构造 初始化
   * **/
  constructor(public ajax:AjaxService, public settings:SettingsService, private router:Router, private route:ActivatedRoute, private routeInfo:ActivatedRoute, private limitComponent:LimitComponent) {
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
     * 请求详细数据，并显示(权限菜单)
     */
    this.ajax.get({
      url: requestUrl,
      async: false, //同步请求
      data: requestData,
      success: (res) => {
        if (res.success) {
          this.limitForm = res.data, this.limitForm['menuCode'] = mc;
        } else {
          let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post limit error");
      }
    });


    /**
     * 请求详细数据，并显示(页面元素)
     */
    this.ajax.get({
      url: requestUrl,
      async: false, //同步请求
      data: requestData,
      success: (res) => {
        if (res.success) {
          this.pageForm = res.data, this.pageForm['pageCode'] = pc;
        } else {
          let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post limit error");
      }
    });


    /**
     * 请求详细数据，并显示(功能操作)
     */
    this.ajax.get({
      url: requestUrl,
      async: false, //同步请求
      data: requestData,
      success: (res) => {
        if (res.success) {
          this.optForm = res.data, this.optForm['pageCode'] = oc;
        } else {
          let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post limit error");
      }
    })


    /**
     * 请求详细数据，并显示(文件控制)
     */
    this.ajax.get({
      url: requestUrl,
      async: false, //同步请求
      data: requestData,
      success: (res) => {
        if (res.success) {
          this.fileForm = res.data, this.fileForm['pageCode'] = fc;
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

  /**
   * 关闭子页面（取消）
   * **/
  cancel() {
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }

  /**
   * 修改（菜单、页面元素、功能操作、文件控制）
   * **/
  addLimitList() {

    let me = this, submitData;
    let submitUrl = '/limitMenu/update';
    if (this.queryId == '1') {
      submitUrl = '/limitPage/update';
      submitData = me.pageForm;
    }else if(this.queryId=='3'){
      submitUrl = '/limitOpt/update';
      submitData = me.optForm;
    }else if(this.queryId=='5'){
      submitUrl = '/limitFile/update';
      submitData = me.fileForm;
    } else {
      submitData = me.limitForm;
    }
    me.ajax.post({
      url: submitUrl,
      async: false,
      data: submitData,
      success: (res) => {
        if (res.success) {
          this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
          swal('提交成功！', '列表已自动更新');
          me.limitComponent.queryDatas();
          me.limitComponent.refresh();
          //this.outputvalue.emit(true);//提交成功后向父组件传值
        } else {
          let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log(res)
        swal('提交失败！');
      }
    })

  }
}
